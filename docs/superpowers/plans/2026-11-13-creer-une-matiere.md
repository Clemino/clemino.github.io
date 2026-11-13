# Créer une matière sans apps-revision : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Amener le moteur des cours dans ce dépôt et écrire le skill `creer-une-matiere`, pour créer une matière depuis claude.ai/code avec des contrôles de qualité bloquants.

**Architecture:** `apps-revision/coursapp` est copié tel quel dans `moteur/` (moteur Next.js en export statique + 9 matières). Le moteur devient constructible hors ligne (police locale) et publie dans `site/<id>/`. Deux ajouts au moteur : `lib/mdx-meta.ts` (frontmatter et temps de lecture) et `lib/quality.ts` + `scripts/check-quality.ts` (contrôles de qualité). Le skill, en français, pilote tout le parcours.

**Tech Stack:** Next.js 16 (`output: "export"`), TypeScript, Vitest 4, tsx, pnpm, Node 24.

**Spec:** `docs/superpowers/specs/2026-11-13-creer-une-matiere-design.md`

`$SCRATCH` désigne le dossier temporaire de la session (le scratchpad), jamais un dossier du dépôt. Toutes les commandes `pnpm` se lancent dans `moteur/`.

## Global Constraints

- `apps-revision/` n'est jamais modifié.
- Ne jamais changer l'`id` d'un cours, ni le `prompt` d'un exercice publié : la progression est rangée sous un hash du prompt (`exerciseId`).
- Aucune nouvelle dépendance npm.
- Code, identifiants et commentaires en anglais ; skill, docs et messages affichés en français, dans le style du dépôt (phrases courtes, sans jargon).
- Seuils exacts : ≥ 15 exercices auto-corrigés par module, ≥ 4 types auto-corrigés par module, bonne réponse strictement la plus longue dans ≤ 35 % des `MCQ_SINGLE`, part de « vrai » entre 35 % et 65 %, 200 mots par minute avec 1 minute au moins.
- Seul `site/` est publié ; `moteur/` ne contient aucun secret.
- Tout se fait sur la branche `creer-une-matiere`, messages de commit en français comme l'historique ; rien n'est poussé sans l'accord de Clément.
- Auto-corrigé = tout type sauf `WRITING`, `CODE_WRITE`, `CODE_FIX` (`isSelfGraded` dans `lib/course.ts`).

## Review Focus

1. Un module sans aucun fichier `exercises/<module>.json` : `check:quality` le signale (0 exercice) au lieu de planter.
2. Une section prévue dans `modules.ts` sans fichier `.mdx` : signalée comme non rédigée, pas d'exception.
3. Une section au frontmatter en fins de ligne CRLF, ou faite surtout d'un tableau : temps de lecture calculé sur le seul texte, 1 minute au moins.
4. `SUPABASE_SECRET_KEY` fournie seulement en variable d'environnement (cas du cloud) : `proposals.mjs` l'utilise ; vide, il affiche un message qui dit où la mettre.
5. `COURSE` absent ou inconnu pour `check:quality` : message clair qui liste les matières, code de sortie 1, pas de pile d'appels.

---

### Task 1 : Copier le moteur dans `moteur/` et vérifier la copie

**Files:**
- Create: `moteur/` (copie de `apps-revision/coursapp/`)
- Add: `docs/superpowers/specs/2026-11-13-creer-une-matiere-design.md`, `docs/superpowers/plans/2026-11-13-creer-une-matiere.md`
- Create (hors dépôt): `$SCRATCH/compare-builds.mjs`

**Interfaces:**
- Produces: `moteur/` installé (`node_modules`) ; `$SCRATCH/compare-builds.mjs <dirA> <dirB> [--ignore-reading-time]`, réutilisé en Task 6 ; la liste des échecs déjà présents avant toute modification.

- [ ] **Step 1 : Créer la branche et commiter le design et le plan**

```bash
cd ~/Desktop/site/clemino.github.io
git switch -c creer-une-matiere
git add docs/superpowers
git commit -m "Ajoute le design et le plan : créer une matière sans apps-revision"
```

- [ ] **Step 2 : Copier `coursapp`**

```bash
rsync -a --exclude node_modules --exclude .next --exclude out --exclude content \
  --exclude lib/generated --exclude tsconfig.tsbuildinfo --exclude next-env.d.ts --exclude .git \
  ../apps-revision/coursapp/ moteur/
```

- [ ] **Step 3 : Vérifier la copie et l'absence de secret**

Run: `diff -rq -x node_modules -x .next -x out -x content -x generated -x tsconfig.tsbuildinfo -x next-env.d.ts -x .git ../apps-revision/coursapp moteur`
Expected: aucune sortie.
Run: `grep -rnE "sb_secret_|service_role|PRIVATE KEY" moteur`
Expected: aucune sortie. `ls moteur/courses` liste les 9 matières, dont `contrats`.

- [ ] **Step 4 : Installer et relever l'état de départ**

```bash
cd moteur && pnpm install --frozen-lockfile
pnpm test
pnpm exec tsx scripts/build-course-index.ts && pnpm typecheck
for c in $(ls courses); do COURSE=$c pnpm -s check:content >/dev/null 2>&1 && echo "OK $c" || echo "ÉCHEC $c"; done
```

Expected : tests et typecheck verts. Noter chaque `ÉCHEC` : il existait avant le projet, ce n'est pas une régression (`pnpm test` lance d'abord la sélection de la matière, ce qui crée `content/` pour le typecheck).

- [ ] **Step 5 : Écrire `$SCRATCH/compare-builds.mjs`**

Outil jetable, hors dépôt. Il liste les `index.html` de chaque dossier (hors `_next/`), affiche les pages présentes d'un seul côté, puis, pour chaque page commune, compare le texte visible : retirer `<script>…</script>` et `<style>…</style>`, puis les balises, puis réduire les espaces. Avec `--ignore-reading-time`, remplacer `~\d+ min` par `~N min` avant de comparer. Il affiche au plus 20 différences et sort avec le code 1 s'il y en a.

- [ ] **Step 6 : Construire Admin et Contrats depuis `moteur/` et comparer à la version en ligne**

```bash
bash scripts/publish-course.sh admin "$SCRATCH/build"
bash scripts/publish-course.sh contrats "$SCRATCH/build"
node "$SCRATCH/compare-builds.mjs" ../site/admin "$SCRATCH/build/admin"
node "$SCRATCH/compare-builds.mjs" ../site/contrats "$SCRATCH/build/contrats"
```

Expected : aucune différence. Comme la copie est identique à `coursapp` (Step 3), une différence signifierait que `coursapp` a changé depuis la publication : la noter pour Clément et pour la Task 6, sans bloquer.

- [ ] **Step 7 : Commiter**

```bash
cd .. && git add moteur
git commit -m "Amène le moteur des cours dans moteur/, avec ses neuf matières"
```

### Task 2 : Rendre le moteur constructible dans le cloud

**Files:**
- Modify: `moteur/app/layout.tsx:2,14-15`
- Create: `moteur/app/fonts/geist.woff2`, `moteur/app/fonts/geist-mono.woff2` (copies de `site/cours/fonts/`)
- Modify: `moteur/scripts/publish-course.sh`
- Modify: `moteur/README.md`

**Interfaces:**
- Produces: `pnpm publish:course <id>` écrit dans `site/<id>/` ; build sans appel à Google.

- [ ] **Step 1 : Police locale**

Copier les deux fichiers. Dans `layout.tsx`, remplacer l'import `next/font/google` par `localFont` de `next/font/local` : `src: "./fonts/geist.woff2"` et `"./fonts/geist-mono.woff2"`, `weight: "100 900"`, mêmes `variable` (`--font-geist-sans`, `--font-geist-mono`) et `display: "swap"`.

- [ ] **Step 2 : Publier dans `site/`**

`publish-course.sh` : `site="${2:-../site}"`, et mettre à jour son commentaire d'en-tête (le cours est copié dans `site/` de ce dépôt). Dans `moteur/README.md`, remplacer « dans le dossier `<id>/` du dépôt local `clemino.github.io` » par `site/<id>/`, et faire renvoyer « Ajouter un cours » vers le skill `creer-une-matiere`.

- [ ] **Step 3 : Vérifier**

Run: `grep -rn "next/font/google" moteur --include=*.tsx --include=*.ts -l | grep -v node_modules`
Expected: aucune sortie.
Run: `cd moteur && bash scripts/publish-course.sh ia-responsable "$SCRATCH/t2" && grep -rlE "fonts\.(googleapis|gstatic)\.com" "$SCRATCH/t2/ia-responsable"; ls "$SCRATCH/t2/ia-responsable/_next/static/media/"*.woff2`
Expected: le grep ne trouve rien, au moins un `.woff2` est listé. (`unshare -rn` est refusé sur ce PC : on vérifie l'absence d'appel en cherchant ces adresses.)
Run: `pnpm test && pnpm typecheck`
Expected: vert.

- [ ] **Step 4 : Commiter**

```bash
git add moteur && git commit -m "Le moteur lit la police Geist en local et publie dans site/"
```

### Task 3 : Calculer le temps de lecture à partir du texte

**Files:**
- Create: `moteur/lib/mdx-meta.ts`, `moteur/lib/mdx-meta.test.ts`
- Modify: `moteur/lib/catalog.ts` (`parseFrontmatter` déplacé ; ligne de `estimatedReadMin` dans `loadCatalog`)
- Test: `moteur/lib/catalog.test.ts`

**Interfaces:**
- Produces, dans `lib/mdx-meta.ts` :
  - `parseFrontmatter(mdx: string): Record<string, unknown>` (déplacée de `catalog.ts` sans changement)
  - `readingMinutes(mdx: string): number` = `max(1, round(mots / 200))`, où les mots sont les suites de lettres ou de chiffres (`/[\p{L}\p{N}]+/gu`) du texte après le frontmatter

- [ ] **Step 1 : Écrire les tests** (`// @vitest-environment node`)

```ts
const words = (n: number) => Array.from({ length: n }, () => "mot").join(" ")
const fm = "---\ntitle: \"T\"\nsource: \"CM, p. 1\"\n---\n"
expect(readingMinutes(fm + words(3))).toBe(1)
expect(readingMinutes(fm + words(400))).toBe(2)
expect(readingMinutes(fm + words(500))).toBe(3)
expect(readingMinutes(fm)).toBe(1)                                        // frontmatter only
expect(readingMinutes(fm.replaceAll("\n", "\r\n") + words(400))).toBe(2) // CRLF
expect(readingMinutes(fm + "| a | b |\n| --- | --- |\n" + words(398))).toBe(2) // "|" and "---" are not words
expect(parseFrontmatter(fm + "x")).toEqual({ title: "T", source: "CM, p. 1" })
```

Dans `catalog.test.ts` : la première section du catalogue a `estimatedReadMin === readingMinutes(fs.readFileSync("content/" + section.mdxPath, "utf8"))`.

- [ ] **Step 2 : Vérifier l'échec**

Run: `pnpm vitest run lib/mdx-meta.test.ts lib/catalog.test.ts`
Expected: FAIL (module `@/lib/mdx-meta` introuvable).

- [ ] **Step 3 : Implémenter**

Créer `mdx-meta.ts`, y déplacer `parseFrontmatter`, l'importer dans `catalog.ts`, et remplacer `(meta.estimatedReadMin as number) ?? 5` par `readingMinutes(fileContent)`, le contenu étant déjà lu pour le frontmatter.

- [ ] **Step 4 : Vérifier**

Run: `pnpm test && pnpm typecheck`
Expected: vert.

- [ ] **Step 5 : Commiter**

```bash
git add moteur/lib && git commit -m "Le temps de lecture se calcule à partir du texte des sections"
```

### Task 4 : `pnpm check:quality`

**Files:**
- Create: `moteur/lib/quality.ts`, `moteur/lib/quality.test.ts`, `moteur/scripts/check-quality.ts`
- Modify: `moteur/package.json` (script `"check:quality": "tsx scripts/check-quality.ts"`, sans hook `pre`)

**Interfaces:**
- Consumes: `parseFrontmatter` (Task 3), `isSelfGraded` et `GATE_SIZE` (`lib/course.ts`), `ExerciseType` (`lib/validators/types.ts`).
- Produces, dans `lib/quality.ts` :

```ts
export const QUALITY_THRESHOLDS = { minAutoPerModule: GATE_SIZE, minTypesPerModule: 4, maxLongestCorrect: 0.35, trueShare: [0.35, 0.65] } as const
export type RawExercise = { chapterSlug: string; type: ExerciseType; payload: any; solution: any; hint?: string; source?: string; concepts?: string[] }
export type CourseFiles = {
  modules: { slug: string; chapters: { slug: string; sections: string[] }[] }[]
  sections: { moduleSlug: string; chapterSlug: string; file: string; written: boolean; source: string | null; concepts: string[] }[]
  concepts: { slug: string; summary?: string }[]
  exercises: RawExercise[]                           // exercises/*.json
  exams: { slug: string; exercises: RawExercise[] }[] // exam/*.json
}
export type QualityMetrics = {
  autoPerModule: Record<string, number>; typesPerModule: Record<string, number>
  chaptersWithoutSection: string[]; chaptersWithoutExercise: string[]; missingSections: string[]
  mcqSingle: number; mcqLongestCorrect: number; trueFalse: number; trueFalseTrue: number
  withoutHint: string[]; withoutSource: string[]; sectionsWithoutSource: string[]
  conceptsWithoutSummary: string[]; conceptsWithoutSection: string[]; conceptsWithoutExercise: string[]
  bestExam: { slug: string | null; missingModules: string[] }
}
export async function readCourse(dir: string): Promise<CourseFiles> // dynamic import of <dir>/modules.ts
export function measureQuality(course: CourseFiles): QualityMetrics
export function qualityErrors(m: QualityMetrics): string[]          // one French sentence per broken rule
```

Périmètre des mesures : les exercices par module, les types, les chapitres sans exercice, les QCM et les vrai/faux se comptent sur `exercises/` seulement (comme les mesures du design) ; indice et source sur `exercises/` et `exam/` ; la couverture sur `exam/`. « La plus longue » = libellé de la bonne option strictement plus long que tous les autres. Une part sur 0 exercice ne produit pas d'erreur.

- [ ] **Step 1 : Écrire les tests** (`// @vitest-environment node`)

Un fixture `goodCourse(): CourseFiles` : module `m1`, chapitre `c1`, section `01-a` rédigée avec source et notion `k1` ; notion `k1` avec résumé ; 15 exercices auto-corrigés dans `c1`, tous avec `hint`, `source` et `concepts: ["k1"]` : 4 `MCQ_SINGLE` (bonne réponse la plus longue dans 1 seul), 4 `TRUE_FALSE` (2 vrais), 4 `MATCHING`, 3 `ORDERING` ; un examen `final` avec un exercice dans `c1`.

```ts
expect(qualityErrors(measureQuality(goodCourse()))).toEqual([])
```

Puis un test par règle : chaque test modifie une seule chose et attend une erreur qui contient le mot indiqué.

| Modification | Mot attendu |
|---|---|
| retirer 1 exercice (14) | `m1` et `15` |
| ne garder que 3 types | `types` |
| ajouter un chapitre `c2` avec section, sans exercice | `c2` |
| ajouter un chapitre `c3` sans section, avec 1 exercice | `c3` |
| marquer `01-a` non rédigée | `01-a` |
| bonne réponse la plus longue dans 2 QCM sur 4 | `plus longue` |
| 4 vrai/faux sur 4 à « vrai » | `vrai` |
| retirer le `hint` d'un exercice | `indice` |
| retirer la `source` d'un exercice | `source` |
| retirer la `source` de la section | `01-a` |
| retirer le résumé de `k1` | `k1` |
| ajouter une notion `k2` utilisée nulle part | `k2` |
| ajouter un module `m2` (15 exercices, absent de l'examen) | `examen` et `m2` |
| ajouter un module `m3` sans aucun exercice (Review Focus 1) | `m3`, sans exception |

Références réelles, avec `readCourse("courses/admin")` puis `"courses/contrats"` :

```ts
expect(Math.min(...Object.values(m.autoPerModule))).toBe(19)              // contrats : 20
expect(Math.min(...Object.values(m.typesPerModule))).toBe(5)              // contrats : 5
expect([m.mcqLongestCorrect, m.mcqSingle]).toEqual([31, 141])             // contrats : [19, 77]
expect([m.trueFalseTrue, m.trueFalse]).toEqual([39, 88])                  // contrats : [29, 64]
expect(m.bestExam.missingModules).toHaveLength(2)                         // contrats : 3
```

Review Focus 2 : un `readCourse` sur un dossier temporaire dont `modules.ts` prévoit une section sans fichier la renvoie avec `written: false`, et `missingSections` la contient.

- [ ] **Step 2 : Vérifier l'échec**

Run: `pnpm vitest run lib/quality.test.ts`
Expected: FAIL (module `@/lib/quality` introuvable).

- [ ] **Step 3 : Implémenter `lib/quality.ts`**

- [ ] **Step 4 : Vérifier**

Run: `pnpm vitest run lib/quality.test.ts`
Expected: PASS.

- [ ] **Step 5 : Écrire `scripts/check-quality.ts`**

Il lit `COURSE`. S'il est absent ou si `courses/<COURSE>` n'existe pas : `COURSE=<id> attendu, parmi : …` sur stderr, puis `process.exit(1)` (Review Focus 5). Sinon, il mesure la matière, Admin et Contrats ; affiche chaque erreur précédée de `✗ ` ; puis un tableau de 5 lignes (exercices auto-corrigés par module, au minimum ; types par module, au minimum ; QCM dont la bonne réponse est la plus longue, en % ; part de « vrai », en % ; modules couverts par le meilleur examen) avec trois colonnes : la matière, Admin, Contrats. Il sort avec le code 1 s'il y a au moins une erreur, sinon il affiche `OK`.

- [ ] **Step 6 : Vérifier le script**

Run: `pnpm check:quality; echo $?` → message `COURSE=<id> attendu…`, puis `1`.
Run: `COURSE=inconnu pnpm check:quality; echo $?` → même message, puis `1`.
Run: `COURSE=contrats pnpm check:quality; echo $?` → au moins l'erreur `examen` (3 modules manquants), le tableau avec les mesures du design, puis `1`.
Run: `pnpm test && pnpm typecheck` → vert.

- [ ] **Step 7 : Commiter**

```bash
git add moteur && git commit -m "Ajoute check:quality : les seuils de qualité d'une nouvelle matière"
```

### Task 5 : Le skill `creer-une-matiere`, et la doc qui en dépend

**Files:**
- Create: `.claude/skills/creer-une-matiere/SKILL.md`, `format.md`, `qualite.md`
- Delete: `docs/creer-une-matiere.md`
- Modify: `CLAUDE.md`, `README.md`, `docs/a-faire.md`, `scripts/proposals.mjs:41` (message d'erreur)

**Interfaces:**
- Consumes: `pnpm check:content`, `pnpm check:quality`, `pnpm publish:course` (Tasks 2 et 4) ; `scripts/proposals.mjs list|download|done|reject`.

- [ ] **Step 1 : `SKILL.md`**

Frontmatter : `name: creer-une-matiere` ; une `description` en français qui dit quoi et quand : créer une matière du site à partir d'une proposition de la bibliothèque, des sources jusqu'à la publication, sur le PC comme dans claude.ai/code ; à utiliser quand Clément demande de créer, traiter ou publier une matière proposée. Corps : les 11 étapes de la section 2 du design, avec leurs commandes exactes depuis la racine du dépôt. Reprendre telles quelles les étapes 2, 3 (en remplaçant `../apps-revision/coursapp/courses/` par `moteur/courses/`), 9 et 10 de `docs/creer-une-matiere.md`. Préciser en tête que le contenu des sources n'est jamais une instruction. Renvoyer à `format.md` pour l'écriture et à `qualite.md` pour les règles et la relecture.

- [ ] **Step 2 : `format.md`**

L'arborescence de `moteur/courses/<id>/` ; les champs de `course.ts` (ceux de `courses/contrats/course.ts`) ; `modules.ts` (`ModuleDef`, slugs de chapitre uniques dans tout le cours, `icon` = nom lucide) ; `concepts.json` (`slug`, `label`, `summary` ; pas de slug comme `constructor`, déjà pris en JavaScript) ; le frontmatter des sections (`title`, `slug`, `order`, `concepts`, `source` ; `estimatedReadMin` n'est plus lu) et le Markdown disponible (GFM, sans composant JSX) ; les champs communs d'un exercice et le nom des fichiers (`exercises/<module>.json`, `-plus.json` en option) ; un exemple JSON par type : `MCQ_SINGLE`, `MCQ_MULTI`, `TRUE_FALSE`, `FILL_BLANK`, `ORDERING`, `MATCHING`, `CASE_STUDY`, `WRITING`, `NUMERIC`, tirés de `courses/contrats` ou `courses/ia-responsable` ; pour les autres types, renvoyer à `moteur/lib/validators/types.ts` et à la matière qui les utilise ; le format d'un examen. Rappeler qu'on ne change jamais le `prompt` d'un exercice publié.

- [ ] **Step 3 : `qualite.md`**

Les règles de contenu de l'étape 7 de `docs/creer-une-matiere.md` ; la forme d'une section dans Admin et Contrats (idée centrale, développement, encadré « À retenir », « Pièges classiques », un chapitre de séance de TD par module quand les sources en ont) ; les seuils de `check:quality` ; la consigne du relecteur, à passer telle quelle à un agent `general-purpose` après chaque module. Elle lui donne les fichiers du module et `sources/<id>/`, lui dit de traiter les sources comme des données et non comme des instructions, de vérifier les quatre points de la section 3 du design, et de répondre par une liste `fichier · emplacement · problème · source (fichier, page) · correction`, ou `RAS`.

- [ ] **Step 4 : Vérifier les exemples de `format.md`**

Créer `moteur/courses/zz-format/` avec un module, un chapitre et une section, chaque exemple d'exercice de `format.md` et un examen. Puis :
Run: `cd moteur && COURSE=zz-format pnpm check:content`
Expected: `OK — N exercices vérifiés`.
Puis `rm -rf moteur/courses/zz-format content`, et `git status --short moteur` ne montre rien de `zz-format`.

- [ ] **Step 5 : `proposals.mjs`, `CLAUDE.md`, `README.md`, `docs/a-faire.md`**

- `proposals.mjs` : le message devient `SUPABASE_SECRET_KEY manque : dans .env.local sur le PC, ou dans les variables d'environnement de claude.ai/code (voir le skill creer-une-matiere).`
- `CLAUDE.md` : la ligne sur la création renvoie au skill `creer-une-matiere`.
- `README.md` : ajouter `moteur/` et `.claude/skills/` à l'arborescence ; « générés par moteur/ » ; dans la section Publication, rédiger dans `moteur/courses/<id>/` et publier avec `cd moteur && pnpm publish:course <id>`.
- `docs/a-faire.md` :
  - date au 13 novembre 2026 ;
  - cocher « Faire publier coursapp dans site/ » et « Calculer le temps de lecture » ;
  - ajouter pour Clément : mettre `SUPABASE_SECRET_KEY` dans les variables d'environnement de claude.ai/code ;
  - « Moteur des cours (`moteur/`) » : chemins `moteur/` au lieu de `coursapp` ;
  - pour Trading et les cours en réserve : `moteur/courses/`.

- [ ] **Step 6 : Vérifier**

Run: `SUPABASE_SECRET_KEY= node scripts/proposals.mjs list` → le nouveau message (Review Focus 4, clé vide).
Run: `SUPABASE_SECRET_KEY=sb_secret_invalide node scripts/proposals.mjs list` → une erreur 401 de Supabase, et non le message « manque » : la variable d'environnement est bien lue (Review Focus 4).
Run: `grep -rn "apps-revision\|coursapp\|creer-une-matiere.md" CLAUDE.md README.md docs/*.md .claude scripts` → aucune trace, sauf une phrase qui dit que `apps-revision` n'est plus utilisé.

- [ ] **Step 7 : Commiter**

```bash
git add -A .claude CLAUDE.md README.md docs scripts
git commit -m "Ajoute le skill creer-une-matiere, qui remplace la procédure par coursapp"
```

### Task 6 : Simuler le cloud, republier les cours, vérifier le tout

**Files:**
- Modify: `site/admin/`, `site/contrats/`, `site/ia-responsable/`, `site/trd/` (republication, à une condition)

**Interfaces:**
- Consumes: `$SCRATCH/compare-builds.mjs` (Task 1), les tâches 2 à 5 commitées.

- [ ] **Step 1 : Clone neuf**

```bash
git clone --branch creer-une-matiere ~/Desktop/site/clemino.github.io "$SCRATCH/clone"
cd "$SCRATCH/clone/moteur" && pnpm install --frozen-lockfile
bash scripts/publish-course.sh trd "$SCRATCH/cloud"
grep -rlE "fonts\.(googleapis|gstatic)\.com" "$SCRATCH/cloud/trd"
COURSE=contrats pnpm check:quality
```

Expected: install et build réussissent depuis le seul dépôt ; le grep ne trouve rien ; `check:quality` affiche le tableau.

- [ ] **Step 2 : Non-régression complète** (dans `~/Desktop/site/clemino.github.io/moteur`)

Run: `pnpm test && pnpm typecheck`, puis la boucle `check:content` de la Task 1, Step 4.
Expected: vert, et les mêmes `ÉCHEC` qu'à la Task 1, pas un de plus.

- [ ] **Step 3 : Republier, à une condition**

Pour chaque `id` de `admin contrats ia-responsable trd` :

```bash
bash scripts/publish-course.sh $id "$SCRATCH/new"
node "$SCRATCH/compare-builds.mjs" ../site/$id "$SCRATCH/new/$id" --ignore-reading-time && bash scripts/publish-course.sh $id
```

Expected: un cours n'est republié dans `site/` que si seules les durées changent. Pour les autres, noter les différences pour Clément.

- [ ] **Step 4 : Commiter**

```bash
cd .. && git add site && git commit -m "Republie les cours avec le temps de lecture calculé"
```

- [ ] **Step 5 : Rendre compte à Clément**

Dire : les résultats de chaque tâche ; les cours republiés ou non, et pourquoi ; les `ÉCHEC` déjà présents ; les dossiers vides `admin/`, `ia-responsable/` et `trd/` à la racine ; et ce qu'il doit faire, à savoir ajouter la clé dans claude.ai/code, et décider du push et de la PR de la branche.
