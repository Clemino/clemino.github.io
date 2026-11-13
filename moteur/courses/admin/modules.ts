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
    slug: "m1-introduction", order: 1, title: "Introduction au droit administratif",
    subtitle: "Histoire, autonomie et critères de l'administration",
    description: "D'où vient le droit administratif, ce qui fait son originalité, et pourquoi il est si difficile de dire ce qu'est exactement l'administration.",
    icon: "Landmark",
    chapters: [
      { slug: "histoire-droit-administratif", order: 1, title: "L'histoire du droit administratif", sections: ["01-histoire-droit-administratif"] },
      { slug: "caracteres-autonomie", order: 2, title: "Les caractères du droit administratif", sections: ["02-caracteres-autonomie"] },
      { slug: "criteres-administration", order: 3, title: "Les critères de l'administration", sections: ["03-criteres-administration"] },
    ],
  },
  {
    slug: "m2-methodologie", order: 2, title: "Méthodologie",
    subtitle: "Dissertation et cas pratique",
    description: "L'examen propose au choix une dissertation ou un cas pratique. Ce module donne la méthode des deux exercices, à appliquer ensuite dans chaque module.",
    icon: "PenLine",
    chapters: [
      { slug: "dissertation", order: 1, title: "La dissertation", sections: ["01-dissertation"] },
      { slug: "cas-pratique", order: 2, title: "Le cas pratique", sections: ["02-cas-pratique"] },
    ],
  },
  {
    slug: "m3-notion-service-public", order: 3, title: "La notion de service public",
    subtitle: "Critères, SPA et SPIC, conséquences",
    description: "Reconnaître un service public, distinguer SPA et SPIC et en tirer le régime et le juge compétents. Séance de TD n° 2.",
    icon: "Building2",
    chapters: [
      { slug: "criteres-service-public", order: 1, title: "Les critères du service public", sections: ["01-criteres-service-public"] },
      { slug: "spa-spic", order: 2, title: "La distinction entre SPA et SPIC", sections: ["02-spa-spic"] },
      { slug: "consequences-distinction", order: 3, title: "Les conséquences de la distinction", sections: ["03-consequences-distinction"] },
      { slug: "td-seance-2", order: 4, title: "Séance 2 : s'entraîner sur la notion", sections: ["04-td-seance-2"] },
    ],
  },
  {
    slug: "m4-regime-service-public", order: 4, title: "Le régime du service public",
    subtitle: "Création, suppression et lois du service public",
    description: "Qui peut créer ou supprimer un service public, et les quatre grands principes : continuité, mutabilité, égalité, neutralité. Séance de TD n° 3, avec cas pratique.",
    icon: "Scale",
    chapters: [
      { slug: "creation-suppression", order: 1, title: "Création et suppression des services publics", sections: ["01-creation-suppression"] },
      { slug: "continuite-mutabilite", order: 2, title: "Continuité et mutabilité", sections: ["02-continuite-mutabilite"] },
      { slug: "egalite", order: 3, title: "Le principe d'égalité", sections: ["03-egalite"] },
      { slug: "neutralite", order: 4, title: "Le principe de neutralité", sections: ["04-neutralite"] },
      { slug: "td-seance-3", order: 5, title: "Séance 3 : cas pratique sur le régime", sections: ["05-td-seance-3"] },
    ],
  },
  {
    slug: "m5-notion-police", order: 5, title: "La notion de police administrative",
    subtitle: "Définition, police judiciaire et ordre public",
    description: "Ce qu'est la police administrative, comment la distinguer de la police judiciaire, et ce que recouvre l'ordre public, de la tranquillité à la dignité. Séance de TD n° 4.",
    icon: "ShieldCheck",
    chapters: [
      { slug: "definition-police", order: 1, title: "Définition et logique de la police", sections: ["01-definition-police"] },
      { slug: "police-administrative-judiciaire", order: 2, title: "Police administrative et police judiciaire", sections: ["02-police-administrative-judiciaire"] },
      { slug: "ordre-public-classique", order: 3, title: "L'ordre public traditionnel", sections: ["03-ordre-public-classique"] },
      { slug: "ordre-public-evolutions", order: 4, title: "Moralité et dignité", sections: ["04-ordre-public-evolutions"] },
    ],
  },
  {
    slug: "m6-regime-police", order: 6, title: "Le régime de la police administrative",
    subtitle: "Autorités, concours et légalité",
    description: "Qui peut prendre une mesure de police, que faire quand plusieurs autorités interviennent, et comment le juge contrôle la mesure. Séance de TD n° 5, avec cas pratique.",
    icon: "Siren",
    chapters: [
      { slug: "autorites-police", order: 1, title: "Les autorités de police", sections: ["01-autorites-police"] },
      { slug: "concours-police", order: 2, title: "Les concours de police", sections: ["02-concours-police"] },
      { slug: "legalite-mesures", order: 3, title: "La légalité des mesures de police", sections: ["03-legalite-mesures"] },
      { slug: "td-seance-5", order: 4, title: "Séance 5 : cas pratique sur la police", sections: ["04-td-seance-5"] },
    ],
  },
  {
    slug: "m7-sources-constitutionnelles", order: 7, title: "Les sources constitutionnelles",
    subtitle: "Invocabilité, loi-écran, QPC et suprématie",
    description: "Comment la Constitution s'impose à l'administration, pourquoi la loi peut faire écran et comment contourner cet écran. Séance de TD n° 6.",
    icon: "BookMarked",
    chapters: [
      { slug: "normes-constitutionnelles", order: 1, title: "L'essor et l'invocabilité des normes constitutionnelles", sections: ["01-normes-constitutionnelles"] },
      { slug: "loi-ecran", order: 2, title: "La théorie de la loi-écran", sections: ["02-loi-ecran"] },
      { slug: "qpc", order: 3, title: "La question prioritaire de constitutionnalité", sections: ["03-qpc"] },
      { slug: "suprematie-constitution", order: 4, title: "La suprématie de la Constitution", sections: ["04-suprematie-constitution"] },
      { slug: "td-seance-6", order: 5, title: "Séance 6 : s'entraîner sur la Constitution", sections: ["05-td-seance-6"] },
    ],
  },
  {
    slug: "m8-sources-internationales", order: 8, title: "Les sources internationales",
    subtitle: "Traités, droit de l'Union et hiérarchie des normes",
    description: "Conditions d'application des traités, primauté du droit international, droit de l'Union européenne et conflits avec la Constitution. Séance de TD n° 7, avec cas pratique.",
    icon: "Globe",
    chapters: [
      { slug: "traites-conditions", order: 1, title: "Les traités et l'article 55", sections: ["01-traites-conditions"] },
      { slug: "primaute-droit-international", order: 2, title: "La coutume et la primauté du droit international", sections: ["02-primaute-droit-international"] },
      { slug: "droit-union-europeenne", order: 3, title: "Le droit de l'Union européenne", sections: ["03-droit-union-europeenne"] },
      { slug: "union-et-constitution", order: 4, title: "Droit de l'Union et Constitution", sections: ["04-union-et-constitution"] },
      { slug: "td-seance-7", order: 5, title: "Séance 7 : cas pratique sur les traités", sections: ["05-td-seance-7"] },
    ],
  },
  {
    slug: "m9-loi-jurisprudence-reglements", order: 9, title: "Lois, jurisprudence, ordonnances et règlements",
    subtitle: "Les sources internes de la légalité",
    description: "Sous la Constitution et les traités : la loi, le rôle du juge, les principes généraux du droit, les ordonnances et la hiérarchie des actes administratifs.",
    icon: "Layers",
    chapters: [
      { slug: "loi-jurisprudence", order: 1, title: "La loi et la jurisprudence", sections: ["01-loi-jurisprudence"] },
      { slug: "principes-generaux-droit", order: 2, title: "Les principes généraux du droit", sections: ["02-principes-generaux-droit"] },
      { slug: "ordonnances-article-38", order: 3, title: "Les ordonnances de l'article 38", sections: ["03-ordonnances-article-38"] },
      { slug: "hierarchie-reglements", order: 4, title: "La hiérarchie des actes administratifs", sections: ["04-hierarchie-reglements"] },
    ],
  },
  {
    slug: "m10-limites-legalite", order: 10, title: "Les limites du principe de légalité",
    subtitle: "Actes hors contrôle, pouvoir discrétionnaire et crises",
    description: "Quand le juge renonce à contrôler, quand la légalité s'assouplit, et comment le droit s'adapte aux crises. Séance de TD n° 9.",
    icon: "Scaling",
    chapters: [
      { slug: "actes-en-deca", order: 1, title: "Les actes en deçà du contrôle du juge", sections: ["01-actes-en-deca"] },
      { slug: "actes-gouvernement", order: 2, title: "Les actes de gouvernement", sections: ["02-actes-gouvernement"] },
      { slug: "pouvoir-discretionnaire", order: 3, title: "Le pouvoir discrétionnaire", sections: ["03-pouvoir-discretionnaire"] },
      { slug: "regimes-crise", order: 4, title: "Les régimes de crise", sections: ["04-regimes-crise"] },
      { slug: "td-seance-9", order: 5, title: "Séance 9 : s'entraîner sur les limites", sections: ["05-td-seance-9"] },
    ],
  },
  {
    slug: "m11-controle-legalite", order: 11, title: "Le contrôle de la légalité",
    subtitle: "Contrôle administratif, juges et recours",
    description: "Qui contrôle l'administration, quel ordre de juridiction saisir, comment régler les conflits et quels recours exercer. Séance de TD n° 10, avec cas pratique.",
    icon: "Gavel",
    chapters: [
      { slug: "controle-administratif", order: 1, title: "Le contrôle administratif", sections: ["01-controle-administratif"] },
      { slug: "ordres-juridictionnels", order: 2, title: "La répartition entre les deux ordres", sections: ["02-ordres-juridictionnels"] },
      { slug: "conflits-questions-prejudicielles", order: 3, title: "Conflits et questions préjudicielles", sections: ["03-conflits-questions-prejudicielles"] },
      { slug: "juridictions-administratives", order: 4, title: "Les juridictions administratives", sections: ["04-juridictions-administratives"] },
      { slug: "recours-contentieux", order: 5, title: "Les recours devant le juge administratif", sections: ["05-recours-contentieux"] },
      { slug: "td-seance-10", order: 6, title: "Séance 10 : cas pratique sur la compétence", sections: ["06-td-seance-10"] },
    ],
  },
]
