#!/usr/bin/env node
/**
 * Handles the course proposals sent from the library.
 * Needs SUPABASE_SECRET_KEY in .env.local at the root of this repository. In claude.ai/code,
 * the key is a network secret instead: the proxy adds it to requests to Supabase.
 *
 *   node scripts/proposals.mjs list
 *   node scripts/proposals.mjs download <proposal-id> <course-id>
 *   node scripts/proposals.mjs done <proposal-id> <course-id>
 *   node scripts/proposals.mjs reject <proposal-id>
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const BUCKET = "proposals"
const COURSE_ID = /^[a-z][a-z0-9-]{1,19}$/

function fail(message) {
  console.error(message)
  process.exit(1)
}

function readEnv() {
  const env = { ...process.env }
  const file = path.join(ROOT, ".env.local")
  if (!fs.existsSync(file)) return env
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (match && !(match[1] in process.env)) env[match[1]] = match[2].replace(/^["']|["']$/g, "")
  }
  return env
}

const env = readEnv()
const BASE_URL = env.SUPABASE_URL ?? "https://fcxrvoloiuicbgbqjoco.supabase.co"
const SECRET_KEY = env.SUPABASE_SECRET_KEY
// Set to "true" in claude.ai/code sessions, where the key never enters the VM.
const REMOTE = env.CLAUDE_CODE_REMOTE === "true"

async function api(pathname, init = {}) {
  if (!SECRET_KEY && !REMOTE) fail("SUPABASE_SECRET_KEY manque dans .env.local (voir le skill creer-une-matiere).")
  // Secret keys go on the apikey header only: the gateway rejects them as a bearer token.
  const key = SECRET_KEY ? { apikey: SECRET_KEY } : {}
  const response = await fetch(BASE_URL + pathname, { ...init, headers: { ...key, ...init.headers } })
  if (!response.ok) {
    const advice = REMOTE && response.status === 401 ? "\nDans claude.ai/code, la clé est un secret réseau de l'environnement (voir le skill creer-une-matiere)." : ""
    fail(`${init.method ?? "GET"} ${pathname} : ${response.status} ${await response.text()}${advice}`)
  }
  return response
}

const storagePath = (proposal, file) =>
  [proposal.user_id, proposal.id, file].map(encodeURIComponent).join("/")

async function getProposal(id) {
  const response = await api(`/rest/v1/course_proposals?id=eq.${encodeURIComponent(id)}&select=*`)
  const [proposal] = await response.json()
  if (!proposal) fail(`Proposition introuvable : ${id}`)
  return proposal
}

/** Same format as the other sources: one [page N] marker per PDF page, to cite answers. */
function writeText(pdf) {
  const pages = execFileSync("pdftotext", [pdf, "-"], { encoding: "utf8", maxBuffer: 1 << 28 }).split("\f")
  if (pages.length && !pages.at(-1).trim()) pages.pop()
  const text = pages.map((page, i) => `[page ${i + 1}]\n${page.trim()}\n\n`).join("")
  fs.writeFileSync(pdf.replace(/\.pdf$/i, ".txt"), text)
  return pages.length
}

async function list() {
  const response = await api("/rest/v1/course_proposals?status=eq.pending&order=created_at.asc&select=*")
  const proposals = await response.json()
  if (!proposals.length) return console.log("Aucune proposition en attente.")
  for (const p of proposals) {
    console.log(`${p.id}\n  ${p.title} · ${p.category} · ${p.created_at.slice(0, 10)}\n  ${p.files.join(", ")}`)
  }
}

async function download(id, courseId) {
  if (!COURSE_ID.test(courseId ?? "")) fail("Identifiant de matière attendu : minuscules, chiffres et tirets, 2 à 20 caractères.")
  const proposal = await getProposal(id)
  const dir = path.join(ROOT, "sources", courseId)
  fs.mkdirSync(dir, { recursive: true })
  for (const file of proposal.files) {
    const response = await api(`/storage/v1/object/${BUCKET}/${storagePath(proposal, file)}`)
    const target = path.join(dir, file)
    fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()))
    console.log(`${path.relative(ROOT, target)} : ${writeText(target)} pages`)
  }
}

async function close(id, status, courseId = null) {
  const proposal = await getProposal(id)
  await api(`/rest/v1/course_proposals?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({ status, course_id: courseId }),
  })
  // A created course is opened to the person who proposed it (supabase/acces-par-personne.sql).
  if (status === "created") {
    await api("/rest/v1/course_access", {
      method: "POST",
      headers: { "content-type": "application/json", prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: proposal.user_id, course: courseId }),
    })
  }
  // The free plan has 1 GB of storage: files leave once the proposal is settled.
  await api(`/storage/v1/object/${BUCKET}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prefixes: proposal.files.map((file) => `${proposal.user_id}/${proposal.id}/${file}`) }),
  })
  console.log(`${proposal.title} : ${status === "created" ? `créée (${courseId}) et ouverte à la personne qui l'a proposée` : "refusée"}, fichiers effacés de Supabase.`)
}

const [command, id, courseId] = process.argv.slice(2)
if (command === "list") await list()
else if (command === "download" && id) await download(id, courseId)
else if (command === "done" && id && COURSE_ID.test(courseId ?? "")) await close(id, "created", courseId)
else if (command === "reject" && id) await close(id, "rejected")
else fail("Usage : list | download <proposition> <matière> | done <proposition> <matière> | reject <proposition>")
