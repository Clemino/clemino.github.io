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
    slug: "m1-critique-ambivalente",
    order: 1,
    title: "Une critique ambivalente",
    subtitle: "Démocratie rare, populisme, crise",
    description:
      "Pourquoi l'on dit la démocratie en crise : un régime rare et fragile, un corps électoral longtemps restreint, la montée de l'abstention et du populisme, et la crise comme moment de jugement. Partie I du cours.",
    icon: "TriangleAlert",
    chapters: [
      {
        slug: "fragilite-rarete",
        order: 1,
        title: "Fragilité et rareté de la démocratie",
        summary: "Indices de démocratie, démos, deux jugements sur la crise, antiparlementarisme.",
        sections: [
          "01-democratie-rare",
          "02-demos-restreint",
          "03-deux-jugements",
          "04-oligarchie-antiparlementarisme",
        ],
      },
      {
        slug: "abstention-populisme",
        order: 2,
        title: "Abstention et populisme",
        summary: "Le mot populisme, ses traits, ses figures, le populisme de gauche.",
        sections: [
          "05-populisme-mot",
          "06-traits-populisme",
          "07-figures-populistes",
          "08-populisme-gauche",
        ],
      },
      {
        slug: "crise-concept-positif",
        order: 3,
        title: "La crise, concept positif ?",
        summary: "Krisis et critique, Rousseau et Machiavel : l'éloge de la dissension.",
        sections: ["09-krisis-critique", "10-rousseau-machiavel"],
      },
    ],
  },
  {
    slug: "m2-pouvoir-demos",
    order: 2,
    title: "Le pouvoir du démos",
    subtitle: "Qui est le peuple, et qui le fait exister ?",
    description:
      "Population de fait et peuple de droit, Aron et Lincoln, la construction juridique du peuple chez Kelsen et Hobbes, puis l'auto-institution du peuple : Rousseau, Negri, Rancière, Colliot-Thélène. Partie II du cours.",
    icon: "Users",
    chapters: [
      {
        slug: "population-peuple",
        order: 1,
        title: "Population de fait, peuple de droit",
        summary: "Le peuple qui manifeste, Aron et le totalitarisme, la formule de Lincoln.",
        sections: ["01-fait-droit", "02-aron-totalitarisme", "03-lincoln"],
      },
      {
        slug: "construction-peuple",
        order: 2,
        title: "La construction juridico-politique du peuple",
        summary: "Kelsen : le peuple défini par le droit ; Hobbes : la multitude n'est pas le peuple.",
        sections: ["04-kelsen-ordre-juridique", "05-kelsen-criteres", "06-hobbes-multitude"],
      },
      {
        slug: "auto-institution",
        order: 3,
        title: "L'auto-institution du peuple",
        summary: "Le cercle du commencement, Rousseau, le pouvoir constituant, la démocratisation.",
        sections: [
          "07-cercle-commencement",
          "08-rousseau-contrat-social",
          "09-negri-pouvoir-constituant",
          "10-democratisation",
          "11-revolte-revolution",
        ],
      },
    ],
  },
  {
    slug: "m3-critiques-principe",
    order: 3,
    title: "Les critiques du principe démocratique",
    subtitle: "Platon, Tocqueville, la tradition, la dictature",
    description:
      "Les adversaires de la démocratie : la mauvaise égalité et l'épistémocratie de Platon, le despotisme de la majorité chez Tocqueville, l'éloge de l'inégalité et de la tradition, les théories de la dictature. Partie III du cours.",
    icon: "Crown",
    chapters: [
      {
        slug: "mauvaise-egalite",
        order: 1,
        title: "La mauvaise égalité et le despotisme de la majorité",
        summary: "Athènes, Platon, Tocqueville.",
        sections: [
          "01-athenes",
          "02-platon-egalite-navire",
          "03-platon-licence",
          "04-platon-demagogie-philosophe-roi",
          "05-tocqueville",
        ],
      },
      {
        slug: "aristocratie-tradition",
        order: 2,
        title: "L'éloge de l'aristocratie et de la tradition",
        summary: "Calliclès, Nietzsche, Land, Yarvin, Burke, de Maistre.",
        sections: ["06-inegalite-naturelle", "07-neoreaction", "08-burke-maistre"],
      },
      {
        slug: "theories-dictature",
        order: 3,
        title: "Les théories de la dictature",
        summary: "Marx et la dictature du prolétariat, de la dictature romaine à Carl Schmitt.",
        sections: ["09-marx", "10-dictature-schmitt"],
      },
    ],
  },
  {
    slug: "m4-deliberation",
    order: 4,
    title: "La politique comme délibération infinie",
    subtitle: "Résister aux abus, accepter le moindre mal",
    description:
      "La démocratie comme délibération et comme résistance aux abus de pouvoir (Aristote, Alain, Locke, Kant, Montesquieu), puis la démocratie libérale comme moindre mal (Churchill, Aron). Partie IV, A et B du cours, où s'arrêtent les notes.",
    icon: "MessagesSquare",
    chapters: [
      {
        slug: "resistance-abus",
        order: 1,
        title: "La démocratie comme résistance aux abus de pouvoir",
        summary: "Aristote, Alain, Locke, Kant, Montesquieu.",
        sections: [
          "01-aristote",
          "02-alain-capitaine-armateur",
          "03-locke",
          "04-kant-declarations",
          "05-montesquieu-alain",
        ],
      },
      {
        slug: "moindre-mal",
        order: 2,
        title: "La démocratie libérale comme moindre mal",
        summary: "Churchill, Aron et le régime constitutionnel pluraliste, une démocratie décevante.",
        sections: ["06-churchill-aron", "07-regles-pluralisme", "08-democratie-decevante"],
      },
    ],
  },
  {
    slug: "m5-repolitisation",
    order: 5,
    title: "L'idéal démocratique comme idéal de repolitisation",
    subtitle: "Représentation, partis, démocratie directe, civisme",
    description:
      "La représentation comme absence du peuple (Rousseau, Sieyès), la liberté des Modernes (Constant, Fukuyama, Berlin), la sociologie des assemblées, la critique des partis (Manin, Simone Weil), les formes de démocratie directe et la réhabilitation du civisme. Partie V du cours.",
    icon: "Vote",
    chapters: [
      {
        slug: "representation-theories",
        order: 1,
        title: "Théories et pratiques de la démocratie représentative",
        summary: "Représentation et absence, Sieyès, la liberté des Modernes, la représentativité des assemblées.",
        sections: [
          "01-representation-absence",
          "02-sieyes",
          "03-liberte-modernes",
          "04-representativite",
        ],
      },
      {
        slug: "critiques-representation",
        order: 2,
        title: "Critiques de la démocratie représentative",
        summary: "Le tri des partis, Manin, Simone Weil, la démocratie directe en pratique.",
        sections: ["05-partis-tri", "06-manin", "07-simone-weil", "08-democratie-directe"],
      },
      {
        slug: "civisme",
        order: 3,
        title: "La réhabilitation du civisme",
        summary: "Rousseau : être citoyen est un état d'esprit, le civisme un calcul d'intérêt.",
        sections: ["09-rousseau-civisme"],
      },
    ],
  },
]
