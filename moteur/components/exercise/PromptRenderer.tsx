"use client"

import { Fragment } from "react"

type Segment =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "code"; text: string }

function parseInline(line: string): Segment[] {
  const out: Segment[] = []
  let buf = ""
  let i = 0
  const flush = () => {
    if (buf) {
      out.push({ kind: "text", text: buf })
      buf = ""
    }
  }
  while (i < line.length) {
    if (line[i] === "*" && line[i + 1] === "*") {
      const end = line.indexOf("**", i + 2)
      if (end !== -1) {
        flush()
        out.push({ kind: "bold", text: line.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }
    if (line[i] === "`") {
      const end = line.indexOf("`", i + 1)
      if (end !== -1) {
        flush()
        out.push({ kind: "code", text: line.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }
    buf += line[i]
    i++
  }
  flush()
  return out
}

export function PromptRenderer({ source }: { source: string }) {
  const blocks = source.split(/\n\n+/)

  return (
    <>
      {blocks.map((b, i) => {
        const fence = b.match(/^```(\w+)?\n([\s\S]*?)\n```$/)
        if (fence) {
          return (
            <pre
              key={i}
              className="my-3 overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-2)] p-3 font-mono text-[13px] leading-relaxed"
            >
              <code>{fence[2]}</code>
            </pre>
          )
        }
        const segments = parseInline(b)
        return (
          <p key={i} className="leading-relaxed">
            {segments.map((s, j) => {
              if (s.kind === "bold")
                return (
                  <strong key={j} className="font-semibold text-[var(--fg-0)]">
                    {s.text}
                  </strong>
                )
              if (s.kind === "code")
                return (
                  <code
                    key={j}
                    className="rounded-[3px] bg-[var(--bg-2)] px-1.5 py-0.5 font-mono text-[13px]"
                  >
                    {s.text}
                  </code>
                )
              return <Fragment key={j}>{s.text}</Fragment>
            })}
          </p>
        )
      })}
    </>
  )
}
