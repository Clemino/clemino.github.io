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
    slug: "m1-introduction",
    order: 1,
    title: "Les finances publiques, finances des APU",
    subtitle: "Définition, chiffres, histoire",
    description:
      "La dépense publique, le déficit et la dette, la notion d'administrations publiques, les lois de finances, et l'histoire des finances publiques de l'Ancien Régime à la Restauration. Introduction du cours.",
    icon: "Landmark",
    chapters: [
      {
        slug: "finances-apu",
        order: 1,
        title: "Des finances publiques définies comme finances des APU",
        summary: "Dépense, déficit, dette, administrations publiques, gouvernance financière.",
        sections: ["01-depense-publique", "02-maastricht-apu", "03-gouvernance-lois-finances"],
      },
      {
        slug: "histoire-finances",
        order: 2,
        title: "Des finances publiques qui ont évolué",
        summary: "Ancien Régime, Révolution, Restauration, et la place centrale de l'État.",
        sections: ["04-ancien-regime", "05-revolution-ddhc", "06-restauration-role-etat"],
      },
    ],
  },
  {
    slug: "m2-liberal-interventionniste",
    order: 2,
    title: "De l'État gendarme à l'État providence",
    subtitle: "Libéralisme, système financier classique, interventionnisme",
    description:
      "La doctrine libérale et le système financier classique du XIXe siècle, puis les causes de l'interventionnisme (guerres, crises, progrès technique, doctrines sociales) et l'accroissement des financements publics. Titre I, chapitres 1 et 2.",
    icon: "Shield",
    chapters: [
      {
        slug: "conception-liberale",
        order: 1,
        title: "Une conception libérale de l'intervention de l'État",
        summary: "L'État gendarme et les quatre traits du système financier classique.",
        sections: ["01-doctrine-liberale", "02-systeme-classique"],
      },
      {
        slug: "etat-providence",
        order: 2,
        title: "Une conception interventionniste de l'État",
        summary: "Guerres, crise de 1929, nationalisations, doctrines sociales, aides publiques.",
        sections: ["03-guerres-crises", "04-nationalisations-doctrines", "05-financements-publics"],
      },
    ],
  },
  {
    slug: "m3-finances-modernes",
    order: 3,
    title: "Les finances publiques modernes et les principes budgétaires",
    subtitle: "Une science pluridisciplinaire, des principes aménagés",
    description:
      "Les finances publiques modernes, entre économie, droit et gestion, puis les grands principes budgétaires de la Restauration (annualité, spécialité, unité, universalité, équilibre) et le principe de sincérité ajouté par la LOLF. Titre I, chapitre 2, section 3.",
    icon: "BookOpen",
    chapters: [
      {
        slug: "science-pluridisciplinaire",
        order: 1,
        title: "Une science pluridisciplinaire",
        summary: "Conjoncture, performance, soutenabilité, économie, droit, gestion, sociologie.",
        sections: ["01-science-pluridisciplinaire"],
      },
      {
        slug: "principes-budgetaires",
        order: 2,
        title: "Les principes budgétaires, atténués et renforcés",
        summary: "Annualité, spécialité, unité, universalité, équilibre, sincérité.",
        sections: ["02-annualite-specialite", "03-unite-universalite-equilibre", "04-sincerite"],
      },
    ],
  },
  {
    slug: "m4-economie-marche",
    order: 4,
    title: "Le triomphe du modèle européen de l'économie de marché",
    subtitle: "Marché intérieur, privatisations, aides d'État, libéralisation",
    description:
      "Le changement de paradigme des années 1970, le marché intérieur et ses règles de concurrence, l'histoire des nationalisations et des privatisations, l'encadrement des aides d'État et la libéralisation des services publics en réseau. Titre I, chapitre 3, section 1.",
    icon: "Store",
    chapters: [
      {
        slug: "marche-interieur",
        order: 1,
        title: "Un nouveau paradigme et le marché intérieur",
        summary: "Libéralisme et keynésianisme, article 119 TFUE, quatre libertés.",
        sections: ["01-changement-paradigme", "02-marche-interieur"],
      },
      {
        slug: "privatisations-liberalisation",
        order: 2,
        title: "Privatisations, aides d'État et libéralisation",
        summary: "Nationalisations et privatisations, article 107 TFUE, service universel.",
        sections: ["03-nationalisations-privatisations", "04-aides-etat-liberalisation"],
      },
    ],
  },
  {
    slug: "m5-deficits-excessifs",
    order: 5,
    title: "La lutte contre les déficits publics excessifs",
    subtitle: "Maastricht, Pacte de stabilité, TSCG, notation",
    description:
      "Le contexte des déficits, les critères de Maastricht et le Pacte de stabilité et de croissance, son renforcement après 2008, le TSCG, la suspension des règles et les nouvelles règles de 2024, leur effet sur les règles nationales, et l'évaluation internationale par le FMI et les agences de notation. Titre I, chapitre 3, section 2.",
    icon: "TrendingDown",
    chapters: [
      {
        slug: "contexte-maastricht",
        order: 1,
        title: "Le contexte et les règles de Maastricht",
        summary: "Chocs pétroliers, effet de ciseau, critères de convergence, Pacte de 1997.",
        sections: ["01-contexte-deficits", "02-maastricht-pacte"],
      },
      {
        slug: "regles-europeennes",
        order: 2,
        title: "Des règles européennes renforcées, suspendues, refondues",
        summary: "Semestre européen, TSCG, clause dérogatoire, règles de 2024.",
        sections: ["03-renforcement-tscg", "04-suspension-nouvelles-regles"],
      },
      {
        slug: "regles-nationales-notation",
        order: 3,
        title: "Règles nationales et évaluation internationale",
        summary: "Équilibre, soutenabilité, LPFP, Haut Conseil, FMI, agences de notation.",
        sections: ["05-regles-nationales", "06-fmi-agences-notation"],
      },
    ],
  },
  {
    slug: "m6-lolf",
    order: 6,
    title: "Vers une meilleure gestion : la LOLF",
    subtitle: "Performance, transparence, revues de dépenses",
    description:
      "La LOLF du 1er août 2001 : ses précédents (RCB, ordonnance de 1959), la programmation par missions et programmes, la liberté et la responsabilité des gestionnaires, le renforcement du Parlement, puis la RGPP, la MAP et CAP 2022. Titre I, chapitre 4.",
    icon: "Gauge",
    chapters: [
      {
        slug: "lolf-efficacite",
        order: 1,
        title: "L'efficacité de la dépense publique",
        summary: "RCB, ordonnance de 1959, missions et programmes, fongibilité asymétrique.",
        sections: ["01-rcb-genese-lolf", "02-missions-programmes", "03-liberte-responsabilite"],
      },
      {
        slug: "lolf-transparence",
        order: 2,
        title: "La transparence de l'action publique",
        summary: "Pouvoir de décision et de contrôle du Parlement, certification des comptes.",
        sections: ["04-pouvoirs-parlement"],
      },
      {
        slug: "revues-depenses",
        order: 3,
        title: "RGPP, MAP, CAP 2022",
        summary: "Les procédures ponctuelles de rationalisation de la dépense.",
        sections: ["05-rgpp-map-cap"],
      },
    ],
  },
  {
    slug: "m7-structures-budgetaires",
    order: 7,
    title: "Les structures budgétaires de l'État",
    subtitle: "Du budget à la loi de finances, le contenu de la loi de finances",
    description:
      "L'éclatement puis l'effacement de la notion classique de budget (décrets de 1862 et 1956, ordonnance de 1959, LOLF), les catégories de lois de finances, puis le contenu de la loi de finances : budget général, recettes fiscales et non fiscales, dépenses, budgets annexes et comptes spéciaux. Finances de l'État, chapitre 1.",
    icon: "FileSpreadsheet",
    chapters: [
      {
        slug: "documents-budgetaires",
        order: 1,
        title: "Une transformation des documents budgétaires",
        summary: "Budgets extraordinaires, textes de 1862, 1956, 1959, LOLF.",
        sections: ["01-eclatement-budget", "02-textes-1862-1959", "03-lolf-lois-finances"],
      },
      {
        slug: "budget-general",
        order: 2,
        title: "Le budget général",
        summary: "Impôts directs et indirects, niches fiscales, classement des dépenses.",
        sections: ["04-ressources-fiscales", "05-impots-indirects-niches", "06-depenses-budget-general"],
      },
      {
        slug: "annexes-comptes-speciaux",
        order: 3,
        title: "Budgets annexes et comptes spéciaux",
        summary: "Les deux budgets annexes et les catégories de comptes spéciaux.",
        sections: ["07-budgets-annexes-comptes-speciaux"],
      },
    ],
  },
  {
    slug: "m8-etat-collectivites",
    order: 8,
    title: "Les relations financières entre l'État et les collectivités",
    subtitle: "Autonomie financière, transferts, contractualisation",
    description:
      "Le cadre constitutionnel de l'autonomie financière locale (article 72-2), la dépendance des collectivités aux transferts de l'État, puis la baisse des dotations, la contractualisation de 2018 et le plan de soutien de 2020. Finances de l'État, chapitre 2.",
    icon: "Building2",
    chapters: [
      {
        slug: "autonomie-financiere",
        order: 1,
        title: "Un cadre contraint : l'autonomie financière locale",
        summary: "Décentralisation, libre administration, les cinq alinéas de l'article 72-2.",
        sections: ["01-decentralisation", "02-article-72-2"],
      },
      {
        slug: "transferts-etat",
        order: 2,
        title: "Des collectivités dépendantes des transferts de l'État",
        summary: "Concours financiers, compensations, subventions, fiscalité transférée.",
        sections: ["03-concours-financiers", "04-compensations-fiscalite-transferee"],
      },
      {
        slug: "debats-dotations",
        order: 3,
        title: "Les débats sur le lien financier État-collectivités",
        summary: "Baisse des dotations, contractualisation, plan de soutien de 2020.",
        sections: ["05-baisse-dotations", "06-contractualisation-soutien"],
      },
    ],
  },
]
