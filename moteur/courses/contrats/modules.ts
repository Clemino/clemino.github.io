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
    slug: "m1-sources-obligation",
    order: 1,
    title: "Les sources de l'obligation",
    subtitle: "Acte juridique, fait juridique, quasi-contrat",
    description:
      "Ce qu'est une obligation, d'où elle naît, et comment le juge a qualifié les loteries publicitaires, de l'engagement unilatéral au quasi-contrat. Séance de TD n° 1.",
    icon: "Network",
    chapters: [
      {
        slug: "obligation-sources",
        order: 1,
        title: "L'obligation et ses sources",
        sections: ["01-obligation-sources"],
      },
      {
        slug: "loteries-publicitaires",
        order: 2,
        title: "Les loteries publicitaires",
        sections: ["02-loteries-publicitaires"],
      },
      {
        slug: "td-seance-1",
        order: 3,
        title: "Séance 1 : la doctrine face aux loteries",
        sections: ["03-td-seance-1"],
      },
    ],
  },
  {
    slug: "m2-methodologie",
    order: 2,
    title: "Méthodologie",
    subtitle: "Lire un arrêt, le commenter, raisonner",
    description:
      "Lire un arrêt de la Cour de cassation, en faire la fiche, le commenter. Puis la dissertation, le cas pratique et le commentaire d'article, selon le fascicule de méthodologie.",
    icon: "PenLine",
    chapters: [
      {
        slug: "lecture-arrets",
        order: 1,
        title: "Lire un arrêt de la Cour de cassation",
        sections: ["01-lecture-arrets"],
      },
      {
        slug: "cas-ouverture-publication",
        order: 2,
        title: "Cas d'ouverture et publication",
        sections: ["02-cas-ouverture-publication"],
      },
      {
        slug: "fiche-arret",
        order: 3,
        title: "La fiche d'arrêt",
        sections: ["03-fiche-arret"],
      },
      {
        slug: "commentaire-arret",
        order: 4,
        title: "Le commentaire d'arrêt",
        sections: ["04-commentaire-arret"],
      },
      {
        slug: "dissertation-cas-pratique",
        order: 5,
        title: "Dissertation et cas pratique",
        sections: ["05-dissertation-cas-pratique"],
      },
      {
        slug: "commentaire-article",
        order: 6,
        title: "Le commentaire d'article",
        sections: ["06-commentaire-article"],
      },
    ],
  },
  {
    slug: "m3-notion-contrat",
    order: 3,
    title: "Le contrat et la réforme de 2016",
    subtitle: "Définition, classifications, principes, droit transitoire",
    description:
      "Ce qu'est un contrat, comment on les classe, les trois principes directeurs, puis la réforme de 2016 et son application dans le temps. Séance de TD n° 2.",
    icon: "FileText",
    chapters: [
      {
        slug: "definition-classifications",
        order: 1,
        title: "Définition et classifications",
        sections: ["01-definition-classifications"],
      },
      {
        slug: "principes-directeurs",
        order: 2,
        title: "Les principes directeurs",
        sections: ["02-principes-directeurs"],
      },
      {
        slug: "reforme-2016",
        order: 3,
        title: "La réforme de 2016",
        sections: ["03-reforme-2016"],
      },
      {
        slug: "application-temps",
        order: 4,
        title: "L'application de la réforme dans le temps",
        sections: ["04-application-temps"],
      },
      {
        slug: "td-seance-2",
        order: 5,
        title: "Séance 2 : contrat involontaire et imprévision",
        sections: ["05-td-seance-2"],
      },
    ],
  },
  {
    slug: "m4-conclusion-contrat",
    order: 4,
    title: "La conclusion du contrat",
    subtitle: "Offre, acceptation, pourparlers, avant-contrats",
    description:
      "Comment l'offre et l'acceptation forment le contrat, ce que coûte une rupture fautive des pourparlers, et la force de la promesse unilatérale et du pacte de préférence. Séances de TD n° 3 et 7.",
    icon: "Handshake",
    chapters: [
      { slug: "offre", order: 1, title: "L'offre", sections: ["01-offre"] },
      {
        slug: "acceptation",
        order: 2,
        title: "L'acceptation",
        sections: ["02-acceptation"],
      },
      {
        slug: "pourparlers",
        order: 3,
        title: "Les pourparlers",
        sections: ["03-pourparlers"],
      },
      {
        slug: "promesse-unilaterale",
        order: 4,
        title: "La promesse unilatérale",
        sections: ["04-promesse-unilaterale"],
      },
      {
        slug: "pacte-preference",
        order: 5,
        title: "Le pacte de préférence",
        sections: ["05-pacte-preference"],
      },
      {
        slug: "td-seances-3-7",
        order: 6,
        title: "Séances 3 et 7 : commenter un revirement",
        sections: ["06-td-seances-3-7"],
      },
    ],
  },
  {
    slug: "m5-erreur-dol",
    order: 5,
    title: "L'erreur et le dol",
    subtitle: "La protection du consentement (1)",
    description:
      "Les règles communes aux vices du consentement, l'erreur qui annule et celle qui est indifférente, puis le dol et la réticence dolosive. Séance de TD n° 4.",
    icon: "SearchX",
    chapters: [
      {
        slug: "vices-consentement",
        order: 1,
        title: "Le consentement et ses vices",
        sections: ["01-vices-consentement"],
      },
      {
        slug: "erreur-nullite",
        order: 2,
        title: "L'erreur, cause de nullité",
        sections: ["02-erreur-nullite"],
      },
      {
        slug: "erreurs-indifferentes",
        order: 3,
        title: "Les erreurs indifférentes",
        sections: ["03-erreurs-indifferentes"],
      },
      { slug: "dol", order: 4, title: "Le dol", sections: ["04-dol"] },
      {
        slug: "td-seance-4",
        order: 5,
        title: "Séance 4 : réticence et devoir de se renseigner",
        sections: ["05-td-seance-4"],
      },
    ],
  },
  {
    slug: "m6-violence-prevention",
    order: 6,
    title: "La violence et la prévention des vices",
    subtitle: "La protection du consentement (2)",
    description:
      "La violence classique, l'abus d'un état de dépendance, puis les mesures qui préviennent les vices : information précontractuelle, réflexion et rétractation. Séance de TD n° 5.",
    icon: "ShieldAlert",
    chapters: [
      {
        slug: "violence-classique",
        order: 1,
        title: "La violence",
        sections: ["01-violence-classique"],
      },
      {
        slug: "abus-dependance",
        order: 2,
        title: "L'abus d'un état de dépendance",
        sections: ["02-abus-dependance"],
      },
      {
        slug: "information-precontractuelle",
        order: 3,
        title: "L'obligation précontractuelle d'information",
        sections: ["03-information-precontractuelle"],
      },
      {
        slug: "reflexion-retractation",
        order: 4,
        title: "Réflexion et rétractation",
        sections: ["04-reflexion-retractation"],
      },
      {
        slug: "td-seance-5",
        order: 5,
        title: "Séance 5 : l'avocat dépendant de son client",
        sections: ["05-td-seance-5"],
      },
    ],
  },
  {
    slug: "m7-capacite-contenu",
    order: 7,
    title: "La capacité et le contenu du contrat",
    subtitle: "Capacité, licéité, certitude, équilibre",
    description:
      "Qui peut contracter, puis ce que le contrat peut contenir : un contenu licite et certain, sans lésion en principe, mais avec une contrepartie réelle. Séance de TD n° 6.",
    icon: "Scale",
    chapters: [
      {
        slug: "capacite",
        order: 1,
        title: "La capacité de contracter",
        sections: ["01-capacite"],
      },
      {
        slug: "contenu-licite",
        order: 2,
        title: "Un contenu licite",
        sections: ["02-contenu-licite"],
      },
      {
        slug: "contenu-certain",
        order: 3,
        title: "Un contenu certain",
        sections: ["03-contenu-certain"],
      },
      {
        slug: "equilibre-contrat",
        order: 4,
        title: "L'équilibre du contrat",
        sections: ["04-equilibre-contrat"],
      },
      {
        slug: "td-seance-6",
        order: 5,
        title: "Séance 6 : la contrepartie et la cause",
        sections: ["05-td-seance-6"],
      },
    ],
  },
]
