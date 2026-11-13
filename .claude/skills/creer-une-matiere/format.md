# Format d'une matière

Une matière vit dans `moteur/courses/<id>/`. Le moteur la lit au build : `COURSE=<id>` choisit la matière.

```
moteur/courses/<id>/
├── course.ts                  Nom, logo et textes de la matière
├── modules.ts                 Modules, chapitres et sections prévues
├── concepts.json              Notions, chacune avec un résumé
├── theory/<module>/<section>.mdx
├── exercises/<module>.json    Exercices de chaque module
└── exam/<examen>.json         Examens blancs
```

**Ne jamais changer le `prompt` d'un exercice publié** : la progression de chacun est rangée sous un identifiant calculé à partir du prompt. Pour corriger une erreur dans l'énoncé d'un exercice publié, prévenir Clément : les élèves perdent sa progression.

## course.ts

```ts
import { HandshakeIcon } from "lucide-react"

export const COURSE = {
  id: "contrats",
  icon: HandshakeIcon,
  title: "contrats.app — Réviser le droit des contrats",
  description: "Plateforme de révision du droit des contrats (L2, semestre 3) : sources de l'obligation, … Parcours linéaire verrouillé, exercices auto-corrigés, cas pratiques et commentaires d'arrêt.",
  label: "L2 · Droit des obligations · Semestre 3",
  heading: ["Réviser", "le droit des contrats"],
  intro: "Parcours strictement linéaire et verrouillé, des sources de l'obligation au contenu du contrat : … Chaque étape doit être validée avant de passer à la suivante.",
  about: "contrats.app — plateforme de révision du droit des contrats, rédigée à partir des notes du cours magistral, des fiches de TD n° 1 à 7 et du fascicule de méthodologie (université, enseignant). Les corrigés types sont rédigés pour s'entraîner : ils ne sont pas officiels et ne remplacent pas le cours.",
  examIntro: "Un galop d'essai sur les modules 1 à 4 et un examen final sur tout le cours, chronométrés et notés /20. Pas de feedback intermédiaire.",
}
```

- `icon` : une icône de [lucide](https://lucide.dev/icons), importée de `lucide-react` avec le suffixe `Icon`. Ses tracés serviront dans `LIBRARY`.
- `title` : le titre de l'onglet. `heading` : le titre de l'accueil, en deux morceaux.
- `about` : d'où vient le contenu, et que les corrigés ne sont pas officiels.

## modules.ts

```ts
export type ModuleDef = {
  slug: string
  order: number
  title: string
  subtitle?: string
  description: string
  icon: string
  chapters: Array<{ slug: string; order: number; title: string; summary?: string; sections: string[] }>
}

export const MODULES: ModuleDef[] = [
  {
    slug: "m1-sources-obligation",
    order: 1,
    title: "Les sources de l'obligation",
    subtitle: "Acte juridique, fait juridique, quasi-contrat",
    description: "Ce qu'est une obligation, d'où elle naît, et comment le juge a qualifié les loteries publicitaires. Séance de TD n° 1.",
    icon: "Network",
    chapters: [
      { slug: "obligation-sources", order: 1, title: "L'obligation et ses sources", sections: ["01-obligation-sources"] },
      { slug: "td-seance-1", order: 2, title: "Séance 1 : la doctrine face aux loteries", sections: ["02-td-seance-1"] },
    ],
  },
]
```

- `slug` de module : `m<N>-<thème>`. `icon` : le nom d'une icône lucide, sans suffixe.
- Les `slug` de chapitre sont uniques dans toute la matière.
- `sections` : les noms des fichiers `.mdx` du dossier `theory/<module>/`, sans extension, numérotés dans l'ordre de tout le module (`01-…`, `02-…`).

## concepts.json

```json
[
  {
    "slug": "obligation",
    "label": "Obligation",
    "summary": "Lien de droit par lequel un créancier peut contraindre un débiteur à exécuter une prestation ou une abstention."
  }
]
```

Le `summary` sert de rappel dans la révision. Un `slug` ne doit pas être un nom déjà pris en JavaScript, comme `constructor` ou `toString`.

## Sections : theory/<module>/<section>.mdx

```mdx
---
title: "L'erreur, cause de nullité"
slug: erreur-nullite
order: 2
concepts: [erreur-qualites-essentielles, alea-erreur]
source: "CM, Partie I, Titre 2, chap. 1 (p. 10-11) ; TD n° 4, doc. 1 à 4"
---

## Idée centrale

Article 1132 : « L'erreur … est une cause de nullité du contrat lorsqu'elle porte sur les **qualités essentielles de la prestation due** … »

| Arrêt | Solution |
| --- | --- |
| Civ. 1re, 22 février 1978 | … |

> **À retenir**
> …

## Pièges classiques

- …
```

- Le frontmatter tient sur une ligne par champ. `concepts` : des `slug` de `concepts.json`. `source` : document et page, ou titre de partie.
- Le temps de lecture est calculé à partir du texte : pas besoin de `estimatedReadMin`.
- Le corps est du Markdown avec tableaux (GFM) : titres `##` et `###`, listes, gras, citations `>`, tableaux, code. Pas de composant JSX.
- Le titre de la section s'affiche déjà : le corps commence par un `##`.

## Exercices : exercises/<module>.json

Un tableau d'exercices. Un fichier `exercises/<module>-plus.json` peut s'y ajouter. Champs communs :

| Champ | Contenu |
|---|---|
| `chapterSlug` | Le chapitre où l'exercice apparaît |
| `type` | Un des types ci-dessous |
| `difficulty` | 1, 2 ou 3 |
| `points` | 1 en général, 3 pour un `CASE_STUDY`, 4 pour un `WRITING` |
| `prompt` | L'énoncé. Unique dans le chapitre |
| `payload` | Ce que l'élève voit, selon le type |
| `solution` | La bonne réponse, selon le type |
| `explanation` | Pourquoi c'est la bonne réponse, montré après la réponse |
| `hint` | Un rappel du cours qui ne donne pas la réponse. Obligatoire sauf pour `WRITING` |
| `concepts` | Des `slug` de `concepts.json` |
| `source` | Document et page |

Les types auto-corrigés comptent pour l'examen de passage du module et pour les examens. `WRITING`, `CODE_WRITE` et `CODE_FIX` se corrigent soi-même, avec le corrigé.

### MCQ_SINGLE : une seule bonne réponse

```json
{
  "chapterSlug": "ai-act",
  "type": "MCQ_SINGLE",
  "difficulty": 2,
  "points": 1,
  "prompt": "Quel plafond d'amende vise les pratiques interdites ?",
  "payload": { "options": [
    { "id": "a", "label": "35 M€ ou 7 %" },
    { "id": "b", "label": "15 M€ ou 3 %" },
    { "id": "c", "label": "20 M€ ou 4 %" },
    { "id": "d", "label": "7 M€ ou 1 %" }
  ] },
  "solution": { "correct": ["a"] },
  "explanation": "35 M€ ou 7 % pour les interdictions, 15 M€ ou 3 % pour certains autres manquements.",
  "hint": "C'est le plafond le plus élevé des deux donnés en cours.",
  "concepts": ["ai-act-calendrier"],
  "source": "Diapositives 29"
}
```

Les options sont mélangées à l'affichage : leur ordre dans le fichier n'a pas d'importance.

### MCQ_MULTI : plusieurs bonnes réponses

```json
{
  "chapterSlug": "comite-tableau-de-bord",
  "type": "MCQ_MULTI",
  "difficulty": 2,
  "points": 1,
  "prompt": "Quelles décisions le comité peut-il prendre ?",
  "payload": { "options": [
    { "id": "a", "label": "Autoriser" },
    { "id": "b", "label": "Refuser" },
    { "id": "c", "label": "Conditionner" },
    { "id": "d", "label": "Reporter sans justification" },
    { "id": "e", "label": "Déléguer au fournisseur" }
  ] },
  "solution": { "correct": ["a", "b", "c"] },
  "explanation": "Autoriser, refuser ou conditionner, avec une justification traçable.",
  "hint": "Toute décision doit être justifiée et traçable.",
  "concepts": ["comite-decision"],
  "source": "Diapositives 36"
}
```

### TRUE_FALSE : vrai ou faux

```json
{
  "chapterSlug": "egalite-des-chances",
  "type": "TRUE_FALSE",
  "difficulty": 1,
  "points": 1,
  "prompt": "FNR = 1 − TPR.",
  "payload": {},
  "solution": { "value": true },
  "explanation": "FNR = FN / (VP + FN), donc FNR + TPR = 1.",
  "hint": "Les deux taux partagent le même dénominateur.",
  "concepts": ["matrice-de-confusion"],
  "source": "Diapositives 19"
}
```

### FILL_BLANK : texte à trous

```json
{
  "chapterSlug": "mesurer-ecarts",
  "type": "FILL_BLANK",
  "difficulty": 2,
  "points": 1,
  "prompt": "Complète la phrase.",
  "payload": {
    "template": "La parité démographique demande que P(Ŷ = 1 ∣ A = a) soit égale à P(Ŷ = 1 ∣ A = {{a}}).",
    "slots": [{ "id": "a", "width": "md" }]
  },
  "solution": { "answers": { "a": ["b"] } },
  "explanation": "Chaque groupe doit avoir le même taux de sélection.",
  "hint": "On compare les deux groupes, notés par deux lettres.",
  "concepts": ["parite-demographique"],
  "source": "Diapositives 15"
}
```

Chaque trou `{{id}}` du `template` a son `slot` et sa liste de réponses acceptées. La casse et les accents sont ignorés par défaut ; `"caseSensitive": true` ou `"stripAccents": false` dans `solution` les rendent significatifs. `width` : `sm`, `md` ou `lg`.

### ORDERING : remise en ordre

```json
{
  "chapterSlug": "note-de-decision",
  "type": "ORDERING",
  "difficulty": 2,
  "points": 1,
  "prompt": "Remets les rubriques de la note de décision dans l'ordre.",
  "payload": { "items": [
    { "id": "i1", "label": "Preuves" },
    { "id": "i3", "label": "Conditions" },
    { "id": "i0", "label": "Objet" },
    { "id": "i2", "label": "Avis" },
    { "id": "i4", "label": "Réexamen" }
  ] },
  "solution": { "order": ["i0", "i1", "i2", "i3", "i4"] },
  "explanation": "On décrit le système, on donne les preuves, on rend un avis, on pose ses conditions, puis on prévoit le réexamen.",
  "hint": "On commence par dire de quel système on parle.",
  "concepts": ["note-de-decision"],
  "source": "Diapositives 41"
}
```

Les `items` sont mélangés à l'affichage, comme la colonne de droite d'une association.

### MATCHING : association

```json
{
  "chapterSlug": "attribution-contrefactuel",
  "type": "MATCHING",
  "difficulty": 2,
  "points": 1,
  "prompt": "Associe chaque notion à sa définition.",
  "payload": {
    "left": [
      { "id": "l0", "label": "Voisin" },
      { "id": "l1", "label": "Prototype" },
      { "id": "l2", "label": "Instance influente" }
    ],
    "right": [
      { "id": "r0", "label": "Une instance proche" },
      { "id": "r1", "label": "Une instance typique" },
      { "id": "r2", "label": "Une instance qui agit sur l'apprentissage" }
    ]
  },
  "solution": { "pairs": { "l0": "r0", "l1": "r1", "l2": "r2" } },
  "explanation": "Trois façons d'expliquer par des exemples.",
  "hint": "Un prototype représente bien un groupe.",
  "concepts": ["contrefactuel"],
  "source": "Diapositives 23"
}
```

### NUMERIC : calcul

```json
{
  "chapterSlug": "mesurer-ecarts",
  "type": "NUMERIC",
  "difficulty": 2,
  "points": 1,
  "prompt": "Le groupe A a un taux de sélection de 0,6 et le groupe B de 0,45. Quel est le ratio d'impact disproportionné B/A ?",
  "payload": { "unit": "" },
  "solution": { "value": 0.75, "absTol": 0.01 },
  "explanation": "0,45 / 0,6 = 0,75 : sous le seuil des 4/5 (0,8), l'écart est jugé significatif.",
  "hint": "On divise le taux du groupe défavorisé par celui du groupe favorisé.",
  "concepts": ["parite-demographique"],
  "source": "Diapositives 16"
}
```

`absTol` (écart absolu) ou `relTol` (écart relatif) fixent la marge acceptée ; `acceptedValues` liste d'autres valeurs justes.

### CASE_STUDY : cas pratique guidé

Un énoncé, puis des sous-questions auto-corrigées (`MCQ_SINGLE`, `MCQ_MULTI`, `TRUE_FALSE`, `FILL_BLANK`, `NUMERIC`).

```json
{
  "chapterSlug": "td-seance-6",
  "type": "CASE_STUDY",
  "difficulty": 3,
  "points": 3,
  "prompt": "Cas d'entraînement : licéité et équilibre.",
  "payload": {
    "scenario": "Tom achète le salon de coiffure de Lina. Le contrat interdit à Lina d'exercer la coiffure « partout en France pendant trente ans ».\n\nTom « vend » ensuite sa voiture à un ami pour un euro.",
    "subQuestions": [
      { "id": "q1", "type": "MCQ_SINGLE", "prompt": "La clause interdisant à Lina d'exercer est-elle valable ?", "payload": { "options": [
        { "id": "a", "label": "Oui, puisque Lina l'a signée" },
        { "id": "b", "label": "Non, elle est disproportionnée dans le temps et l'espace" },
        { "id": "c", "label": "Oui, la liberté contractuelle permet toute clause acceptée par les deux parties" }
      ] } },
      { "id": "q2", "type": "TRUE_FALSE", "prompt": "La vente de la voiture pour un euro est valable, puisque le prix est libre.", "payload": {} }
    ]
  },
  "solution": { "subSolutions": [
    { "id": "q1", "solution": { "correct": ["b"] } },
    { "id": "q2", "solution": { "value": false } }
  ] },
  "explanation": "Clause : une clause de non-concurrence n'est valable que si elle est proportionnée, limitée dans le temps et l'espace. Voiture : un contrat à titre onéreux dont la contrepartie est dérisoire est nul (art. 1169).",
  "hint": "Pour chaque situation, cherche la liberté ou l'équilibre en cause.",
  "concepts": ["clause-restrictive", "contrepartie-illusoire"],
  "source": "CM, Partie I, Titre 2, chap. 3 (p. 15-17) ; TD n° 6, doc. 5"
}
```

`"weight"` sur une sous-question change sa part dans la note.

### WRITING : rédaction, corrigée par l'élève

```json
{
  "chapterSlug": "td-seance-2",
  "type": "WRITING",
  "difficulty": 3,
  "points": 4,
  "prompt": "Dans quelle mesure les juges peuvent-ils interpréter l'ancien code civil à la lumière de la réforme de 2016 ? Rédige un plan détaillé.",
  "payload": {
    "modelAnswer": "Introduction : …\n\nI. Une interprétation admise. A. … B. …\n\nII. Une interprétation limitée. A. … B. …",
    "rubric": [
      { "id": "c0", "label": "L'article 9 de l'ordonnance est exposé" },
      { "id": "c1", "label": "L'effet déclaratif de la jurisprudence est expliqué" },
      { "id": "c2", "label": "Le plan répond à la question « dans quelle mesure » et ne se contente pas de décrire" }
    ]
  },
  "solution": {},
  "explanation": "Ce plan n'est qu'un exemple d'entraînement, pas un corrigé officiel.",
  "concepts": ["interpretation-anticipation"],
  "source": "TD n° 2, exercice 2"
}
```

L'élève compare sa réponse au `modelAnswer` et coche les critères de la `rubric` (3 au moins). Pas de `hint`.

### Autres types

Les autres types servent à des matières particulières : `PREDICT_OUTPUT`, `CODE_WRITE`, `CODE_FIX` et `CODE_ANALYSIS` (programmation, voir `courses/cpp`), `ALGO_TRACE` et `FIGURE_INTERPRET` (`courses/ia`), `CHART_READ` et `TRADE_PLAN` (`courses/trd`), les réseaux de Petri `PETRI_*` (`courses/psr`), `SQL_DDL` et `PLSQL_*` (bases de données). Leur `payload` et leur `solution` sont décrits dans `moteur/lib/validators/types.ts`.

## Examens : exam/<examen>.json

```json
{
  "slug": "examen-final",
  "title": "Examen final",
  "description": "Tout le cours, 120 minutes, noté sur 20. Pas de feedback intermédiaire.",
  "durationMinutes": 120,
  "exercises": []
}
```

`exercises` contient des exercices au format ci-dessus, avec leur `chapterSlug`. Le total des points est calculé. Les exercices `WRITING` d'un examen restent dans leur chapitre mais ne sont pas notés à l'examen.
