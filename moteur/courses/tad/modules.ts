// Course structure: modules and their chapters. Chapter slugs are globally unique.

export type ModuleDef = {
  slug: string
  order: number
  title: string
  subtitle?: string
  description: string
  icon: string
  chapters: Array<{
    slug: string
    order: number
    title: string
    summary?: string
    sections: string[]
  }>
}

export const MODULES: ModuleDef[] = [
  {
    slug: "niveau-externe",
    order: 1,
    title: "Niveau Externe & Architecture SPARC",
    subtitle: "CM1 — Utilisateurs, rôles, privilèges, vues",
    description:
      "Le niveau externe SPARC : utilisateurs Oracle, rôles, privilèges système et objet, vues logiques et matérialisées.",
    icon: "Layers",
    chapters: [
      {
        slug: "architecture-sparc",
        order: 1,
        title: "Architecture SPARC",
        sections: ["01-architecture-sparc"],
      },
      {
        slug: "utilisateurs-roles",
        order: 2,
        title: "Utilisateurs et rôles",
        sections: ["02-utilisateurs-roles"],
      },
      {
        slug: "privileges",
        order: 3,
        title: "Privilèges",
        sections: ["03-privileges"],
      },
      {
        slug: "vues",
        order: 4,
        title: "Vues logiques et matérialisées",
        sections: ["04-vues"],
      },
    ],
  },
  {
    slug: "tablespaces-index",
    order: 2,
    title: "Tablespaces, Index, Clusters",
    subtitle: "CM2 — Structures physiques et accélérateurs",
    description:
      "Le niveau physique Oracle : tablespaces, segments, fichiers ; index B-tree et Bitmap ; clusters.",
    icon: "HardDrive",
    chapters: [
      {
        slug: "stockage-physique",
        order: 1,
        title: "Structure physique Oracle",
        sections: ["01-stockage-physique"],
      },
      {
        slug: "indexs-btree",
        order: 2,
        title: "Indexs B-tree et sélectivité",
        sections: ["02-indexs-btree"],
      },
      {
        slug: "indexs-bitmap",
        order: 3,
        title: "Indexs Bitmap",
        sections: ["03-indexs-bitmap"],
      },
      {
        slug: "creation-indexs",
        order: 4,
        title: "Création d'indexs en pratique",
        sections: ["04-creation-indexs"],
      },
      {
        slug: "clusters",
        order: 5,
        title: "Clusters",
        sections: ["05-clusters"],
      },
    ],
  },
  {
    slug: "transactions",
    order: 3,
    title: "Transactions & Concurrence",
    subtitle: "CM3 — ACID, verrouillage, OLTP",
    description:
      "Propriétés ACID, COMMIT/ROLLBACK, savepoints, verrouillage de ligne, deadlocks, OLTP.",
    icon: "GitBranch",
    chapters: [
      {
        slug: "notion-transaction",
        order: 1,
        title: "Notion de transaction",
        sections: ["01-notion-transaction"],
      },
      {
        slug: "acid",
        order: 2,
        title: "Propriétés ACID",
        sections: ["02-acid"],
      },
      {
        slug: "commit-rollback-savepoint",
        order: 3,
        title: "COMMIT, ROLLBACK, SAVEPOINT",
        sections: ["03-commit-rollback-savepoint"],
      },
      {
        slug: "concurrence",
        order: 4,
        title: "Concurrence, verrouillage, deadlock",
        sections: ["04-concurrence"],
      },
      {
        slug: "schema-synonyme",
        order: 5,
        title: "Schémas et synonymes",
        sections: ["05-divers-schema-synonyme"],
      },
    ],
  },
  {
    slug: "bddr",
    order: 4,
    title: "Bases de données réparties (BDDR)",
    subtitle: "CM4 — Fragmentation, database links, réplication",
    description:
      "Conception répartie, fragmentation horizontale/verticale/mixte, database links Oracle, réplication.",
    icon: "Network",
    chapters: [
      {
        slug: "introduction-bddr",
        order: 1,
        title: "Introduction aux BDD réparties",
        sections: ["01-introduction-bddr"],
      },
      {
        slug: "fragmentation",
        order: 2,
        title: "Fragmentation H/V/Mixte",
        sections: ["02-fragmentation"],
      },
      {
        slug: "database-link",
        order: 3,
        title: "Database Links",
        sections: ["03-database-link"],
      },
      {
        slug: "replication",
        order: 4,
        title: "Réplication",
        sections: ["04-replication"],
      },
    ],
  },
  {
    slug: "plsql-fondamentaux",
    order: 5,
    title: "PL/SQL — Fondamentaux",
    subtitle: "CM5 — Variables, contrôle, triggers, séquences",
    description:
      "Blocs PL/SQL, types scalaires et composés, structures de contrôle, triggers sur table et vue, séquences.",
    icon: "Code",
    chapters: [
      {
        slug: "generalites-plsql",
        order: 1,
        title: "Généralités PL/SQL",
        sections: ["01-generalites"],
      },
      {
        slug: "variables-types",
        order: 2,
        title: "Variables et types",
        sections: ["02-variables-types"],
      },
      {
        slug: "structures-controle",
        order: 3,
        title: "Structures de contrôle",
        sections: ["03-structures-controle"],
      },
      {
        slug: "triggers",
        order: 4,
        title: "Triggers",
        sections: ["04-triggers"],
      },
      {
        slug: "sequences",
        order: 5,
        title: "Séquences",
        sections: ["05-sequences"],
      },
    ],
  },
  {
    slug: "plsql-avance",
    order: 6,
    title: "PL/SQL — Procédures, Curseurs, Exceptions, Packages",
    subtitle: "CM6 — Programmation procédurale stockée",
    description:
      "Procédures et fonctions stockées, curseurs implicites et explicites, gestion d'exceptions, packages.",
    icon: "Boxes",
    chapters: [
      {
        slug: "procedures-fonctions",
        order: 1,
        title: "Procédures et fonctions",
        sections: ["01-procedures-fonctions"],
      },
      {
        slug: "curseurs",
        order: 2,
        title: "Curseurs",
        sections: ["02-curseurs"],
      },
      {
        slug: "exceptions",
        order: 3,
        title: "Gestion des exceptions",
        sections: ["03-exceptions"],
      },
      {
        slug: "packages",
        order: 4,
        title: "Packages",
        sections: ["04-packages"],
      },
    ],
  },
]
