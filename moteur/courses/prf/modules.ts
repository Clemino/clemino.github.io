// Course structure: modules and their chapters. Chapter slugs are globally unique.

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
    slug: "m1-scala-fondamentaux",
    order: 1,
    title: "Scala fondamental",
    subtitle: "Expressions, valeurs, types et premiers raisonnements",
    description:
      "Les bases du langage Scala et du paradigme fonctionnel : expression, immutabilite, typage statique, blocs, Option, tuples et controle par expressions.",
    icon: "BookOpen",
    chapters: [
      { slug: "paradigme-expressions", order: 1, title: "Paradigme fonctionnel et expressions", sections: ["01-paradigme-expressions"] },
      { slug: "types-valeurs-blocs", order: 2, title: "Types, valeurs et blocs", sections: ["02-types-valeurs-blocs"] },
      { slug: "option-tuples-if", order: 3, title: "Option, tuples et controles", sections: ["03-option-tuples-if"] },
    ],
  },
  {
    slug: "m2-fonctions-purete",
    order: 2,
    title: "Fonctions et purete",
    subtitle: "Definir, composer et evaluer des fonctions",
    description:
      "Fonctions pures, parametres, evaluation par valeur ou par nom, recursion terminale, fonctions d'ordre superieur, currying et raisonnement equationnel.",
    icon: "FunctionSquare",
    chapters: [
      { slug: "def-parametres", order: 1, title: "def, parametres et contrats", sections: ["01-def-parametres"] },
      { slug: "evaluation-recursion", order: 2, title: "Evaluation et recursion", sections: ["02-evaluation-recursion"] },
      { slug: "fonctions-ordre-superieur", order: 3, title: "Fonctions d'ordre superieur", sections: ["03-fonctions-ordre-superieur"] },
    ],
  },
  {
    slug: "m3-objets-modelisation",
    order: 3,
    title: "Objets en Scala",
    subtitle: "Classes, objets compagnons, traits et generiques",
    description:
      "La partie objet de Scala : classes, constructeurs, methodes, objets singletons, compagnons, case class, traits, types generiques et variance.",
    icon: "Boxes",
    chapters: [
      { slug: "classes-objets", order: 1, title: "Classes, objets et constructeurs", sections: ["01-classes-objets"] },
      { slug: "compagnons-case-sealed", order: 2, title: "Compagnons, case class et sealed", sections: ["02-compagnons-case-sealed"] },
      { slug: "traits-generiques", order: 3, title: "Traits, generiques et variance", sections: ["03-traits-generiques"] },
    ],
  },
  {
    slug: "m4-collections",
    order: 4,
    title: "Collections fonctionnelles",
    subtitle: "Transformer, combiner et raisonner sur les collections",
    description:
      "Collections immuables et mutables, List, Vector, Set, Map, Option, map/filter/flatMap, folds, groupBy, LazyList et parallelisme.",
    icon: "Layers",
    chapters: [
      { slug: "hierarchie-collections", order: 1, title: "Hierarchie et familles de collections", sections: ["01-hierarchie-collections"] },
      { slug: "transformations", order: 2, title: "map, filter, flatMap et for", sections: ["02-transformations"] },
      { slug: "folds-requetes-parallelisme", order: 3, title: "folds, requetes et parallelisme", sections: ["03-folds-requetes-parallelisme"] },
    ],
  },
  {
    slug: "m5-complexite-preuves",
    order: 5,
    title: "Complexite et preuves",
    subtitle: "Evaluer les couts et prouver les algorithmes",
    description:
      "Analyse temporelle et spatiale, O/Omega/Theta, cas pire/moyen/meilleur, tris, recurrences, diviser pour regner, invariants et terminaison.",
    icon: "Sigma",
    chapters: [
      { slug: "analyse-asymptotique", order: 1, title: "Analyse asymptotique", sections: ["01-analyse-asymptotique"] },
      { slug: "recursivite-diviser-regner", order: 2, title: "Recursivite et diviser pour regner", sections: ["02-recursivite-diviser-regner"] },
      { slug: "invariants-correction", order: 3, title: "Invariants, terminaison et correction", sections: ["03-invariants-correction"] },
    ],
  },
  {
    slug: "m6-petri-dynamique",
    order: 6,
    title: "Reseaux de Petri I",
    subtitle: "Structure, marquages et dynamique",
    description:
      "Places, transitions, arcs ponderes, marquage initial, franchissement, sequences de tir, Pre/Post, incidence et equation d'etat.",
    icon: "Network",
    chapters: [
      { slug: "definition-marquage", order: 1, title: "Definition et marquage", sections: ["01-definition-marquage"] },
      { slug: "franchissement-sequences", order: 2, title: "Franchissement et sequences", sections: ["02-franchissement-sequences"] },
      { slug: "matrices-equation-etat", order: 3, title: "Matrices et equation d'etat", sections: ["03-matrices-equation-etat"] },
    ],
  },
  {
    slug: "m7-petri-analyse",
    order: 7,
    title: "Reseaux de Petri II",
    subtitle: "Accessibilite, proprietes et modelisation",
    description:
      "Graphe des marquages accessibles, bornitude, surete, vivacite, blocage, invariants de places/transitions et modeles concurrents classiques.",
    icon: "Workflow",
    chapters: [
      { slug: "graphe-accessibilite", order: 1, title: "Graphe d'accessibilite", sections: ["01-graphe-accessibilite"] },
      { slug: "proprietes", order: 2, title: "Bornitude, surete, vivacite et blocages", sections: ["02-proprietes"] },
      { slug: "invariants-modelisation", order: 3, title: "Invariants et modelisation", sections: ["03-invariants-modelisation"] },
    ],
  },
  {
    slug: "m8-synthese-examens",
    order: 8,
    title: "Synthese et partiels blancs",
    subtitle: "Croiser Scala, complexite et reseaux de Petri",
    description:
      "Revision finale, pieges frequents, strategie de partiel et exercices transversaux pour viser une copie complete.",
    icon: "Trophy",
    chapters: [
      { slug: "strategie-partiel", order: 1, title: "Strategie de partiel", sections: ["01-strategie-partiel"] },
      { slug: "synthese-transversale", order: 2, title: "Synthese transversale", sections: ["02-synthese-transversale"] },
    ],
  },
]
