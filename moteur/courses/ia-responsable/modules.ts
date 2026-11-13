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
    slug: "m1-fondations", order: 1, title: "Fondations",
    subtitle: "Le dossier de confiance et l'origine des préjudices",
    description: "Ce qu'un dossier de confiance doit prouver, les choix de valeurs cachés dans un modèle, et les étapes du cycle de vie où naît un préjudice.",
    icon: "Layers",
    chapters: [
      { slug: "dossier-de-confiance", order: 1, title: "Les cinq pièces du dossier de confiance", sections: ["01-dossier-de-confiance"] },
      { slug: "choix-de-valeurs", order: 2, title: "Les choix de valeurs dans le modèle", sections: ["02-choix-de-valeurs"] },
      { slug: "prejudice-cycle-de-vie", order: 3, title: "Le préjudice dans le cycle de vie", sections: ["03-prejudice-cycle-de-vie"] },
    ],
  },
  {
    slug: "m2-risques", order: 2, title: "Pièce 1 · Risques",
    subtitle: "Prioriser, tracer, documenter, surveiller",
    description: "Coter les risques, apprendre des incidents, tenir un registre, tracer chaque décision, documenter les artefacts et surveiller les dérives.",
    icon: "TriangleAlert",
    chapters: [
      { slug: "prioriser-risques", order: 1, title: "Prioriser les risques", sections: ["01-prioriser-risques"] },
      { slug: "registre-tracabilite", order: 2, title: "Registre et traçabilité", sections: ["02-registre-tracabilite"] },
      { slug: "documentation-derive", order: 3, title: "Documentation et dérive", sections: ["03-documentation-derive"] },
    ],
  },
  {
    slug: "m3-equite", order: 3, title: "Pièce 2 · Équité",
    subtitle: "Mesurer les écarts entre groupes et les atténuer",
    description: "Pourquoi une moyenne masque les écarts, comment les mesurer (ratio de sélection, parité, égalité des chances) et à quel moment les corriger.",
    icon: "Scale",
    chapters: [
      { slug: "mesurer-ecarts", order: 1, title: "Mesurer les écarts", sections: ["01-mesurer-ecarts"] },
      { slug: "egalite-des-chances", order: 2, title: "Égalité des chances et matrice de confusion", sections: ["02-egalite-des-chances"] },
      { slug: "attenuer-biais", order: 3, title: "Atténuer un biais", sections: ["03-attenuer-biais"] },
    ],
  },
  {
    slug: "m4-explicabilite", order: 4, title: "Pièce 3 · Explicabilité et recours",
    subtitle: "Expliquer une sortie, superviser, permettre de contester",
    description: "Les notions pour examiner une explication, les méthodes d'attribution et le contrefactuel, puis la supervision humaine et le circuit de contestation.",
    icon: "Lightbulb",
    chapters: [
      { slug: "examiner-explication", order: 1, title: "Examiner une explication", sections: ["01-examiner-explication"] },
      { slug: "attribution-contrefactuel", order: 2, title: "Attributions et contrefactuels", sections: ["02-attribution-contrefactuel"] },
      { slug: "supervision-contestation", order: 3, title: "Supervision et contestation", sections: ["03-supervision-contestation"] },
    ],
  },
  {
    slug: "m5-conformite", order: 5, title: "Pièce 4 · Conformité",
    subtitle: "AI Act, RGPD, LLM et exploitation",
    description: "Qualifier un système au regard de l'AI Act, réunir les preuves attendues, poser les questions RGPD et contrôler un LLM avec RAG en exploitation.",
    icon: "Landmark",
    chapters: [
      { slug: "ai-act", order: 1, title: "L'AI Act", sections: ["01-ai-act"] },
      { slug: "rgpd", order: 2, title: "Le RGPD dans le pipeline", sections: ["02-rgpd"] },
      { slug: "llm-exploitation", order: 3, title: "LLM, RAG et exploitation responsable", sections: ["03-llm-exploitation"] },
    ],
  },
  {
    slug: "m6-decision", order: 6, title: "Pièce 5 · Décision et gouvernance",
    subtitle: "Décider, suivre, défendre son avis",
    description: "Le comité de décision, le tableau de bord, la note de décision, puis le projet et son évaluation.",
    icon: "ClipboardCheck",
    chapters: [
      { slug: "comite-tableau-de-bord", order: 1, title: "Comité de décision et tableau de bord", sections: ["01-comite-tableau-de-bord"] },
      { slug: "note-de-decision", order: 2, title: "Dire non et rédiger la note de décision", sections: ["02-note-de-decision"] },
      { slug: "projet-evaluation", order: 3, title: "Le projet et son évaluation", sections: ["03-projet-evaluation"] },
    ],
  },
]
