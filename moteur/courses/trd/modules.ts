// Course structure: 15 modules and their chapters. Chapter slugs are globally unique.

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
  // Bloc 1 — Fondations
  {
    slug: "m1-marches-financiers",
    order: 1,
    title: "Comprendre les marchés financiers",
    subtitle: "Bourse, actifs, indices et acteurs",
    description:
      "À quoi sert la bourse, ce que l'on achète vraiment avec une action ou une obligation, comment se lisent un indice et un ETF, qui sont les acteurs du marché et comment fonctionne une séance sur Euronext.",
    icon: "Landmark",
    chapters: [
      {
        slug: "role-de-la-bourse",
        order: 1,
        title: "À quoi sert la bourse",
        sections: ["01-role-de-la-bourse"],
      },
      {
        slug: "actions-obligations",
        order: 2,
        title: "Actions et obligations",
        sections: ["02-actions-obligations"],
      },
      {
        slug: "indices-etf",
        order: 3,
        title: "Indices et ETF",
        sections: ["03-indices-etf"],
      },
      {
        slug: "acteurs-regulateurs",
        order: 4,
        title: "Les acteurs : émetteurs, intermédiaires, AMF et ESMA",
        sections: ["04-acteurs-regulateurs"],
      },
      {
        slug: "euronext-cotation",
        order: 5,
        title: "Euronext, horaires et cotation",
        sections: ["05-euronext-cotation"],
      },
    ],
  },
  {
    slug: "m2-passer-un-ordre",
    order: 2,
    title: "Ouvrir un compte et passer un ordre",
    subtitle: "Courtier, enveloppes, ordres, frais et fiscalité",
    description:
      "Choisir un courtier régulé, comprendre PEA et CTO, maîtriser les types d'ordres, lire un carnet d'ordres, mesurer l'impact des frais et de la fiscalité, et repérer les arnaques.",
    icon: "ReceiptText",
    chapters: [
      {
        slug: "choisir-courtier",
        order: 1,
        title: "Choisir un courtier régulé",
        sections: ["01-choisir-courtier"],
      },
      {
        slug: "pea-cto",
        order: 2,
        title: "PEA et CTO",
        sections: ["02-pea-cto"],
      },
      {
        slug: "types-ordres",
        order: 3,
        title: "Types d'ordres : marché, limite, stop",
        sections: ["03-types-ordres"],
      },
      {
        slug: "carnet-spread-liquidite",
        order: 4,
        title: "Carnet d'ordres, spread et liquidité",
        sections: ["04-carnet-spread-liquidite"],
      },
      {
        slug: "frais-impact",
        order: 5,
        title: "Les frais et leur impact",
        sections: ["05-frais-impact"],
      },
      {
        slug: "fiscalite-plus-values",
        order: 6,
        title: "Fiscalité des plus-values",
        sections: ["06-fiscalite-plus-values"],
      },
      {
        slug: "reperer-arnaques",
        order: 7,
        title: "Repérer les arnaques",
        sections: ["07-reperer-arnaques"],
      },
    ],
  },
  {
    slug: "m3-crypto-actifs",
    order: 3,
    title: "Crypto-actifs",
    subtitle: "Blockchain, plateformes, réglementation et risques",
    description:
      "Comprendre la blockchain et le bitcoin, ethereum, tokens et stablecoins, choisir une plateforme et sécuriser un wallet, connaître MiCA, la fiscalité crypto en France et les risques propres aux cryptos.",
    icon: "Bitcoin",
    chapters: [
      {
        slug: "blockchain-bitcoin",
        order: 1,
        title: "Blockchain et bitcoin",
        sections: ["01-blockchain-bitcoin"],
      },
      {
        slug: "ethereum-tokens-stablecoins",
        order: 2,
        title: "Ethereum, tokens et stablecoins",
        sections: ["02-ethereum-tokens-stablecoins"],
      },
      {
        slug: "plateformes-wallets-securite",
        order: 3,
        title: "Plateformes, wallets et sécurité",
        sections: ["03-plateformes-wallets-securite"],
      },
      {
        slug: "mica-prestataires",
        order: 4,
        title: "MiCA et prestataires agréés",
        sections: ["04-mica-prestataires"],
      },
      {
        slug: "fiscalite-crypto",
        order: 5,
        title: "Fiscalité crypto en France",
        sections: ["05-fiscalite-crypto"],
      },
      {
        slug: "risques-crypto",
        order: 6,
        title: "Risques propres aux cryptos",
        sections: ["06-risques-crypto"],
      },
    ],
  },
  // Bloc 2 — Analyse
  {
    slug: "m4-analyse-fondamentale",
    order: 4,
    title: "Analyse fondamentale",
    subtitle: "Lire les comptes et valoriser une entreprise",
    description:
      "Lire un bilan, un compte de résultat et un tableau de flux de trésorerie, calculer les ratios clés et estimer une valeur par actualisation des flux.",
    icon: "FileSpreadsheet",
    chapters: [
      {
        slug: "lire-un-bilan",
        order: 1,
        title: "Lire un bilan",
        sections: ["01-lire-un-bilan"],
      },
      {
        slug: "resultat-flux-tresorerie",
        order: 2,
        title: "Compte de résultat et flux de trésorerie",
        sections: ["02-resultat-flux-tresorerie"],
      },
      {
        slug: "ratios-cles",
        order: 3,
        title: "Ratios clés",
        sections: ["03-ratios-cles"],
      },
      {
        slug: "valorisation-actualisation",
        order: 4,
        title: "Valorisation par actualisation",
        sections: ["04-valorisation-actualisation"],
      },
    ],
  },
  {
    slug: "m5-analyse-technique-bases",
    order: 5,
    title: "Analyse technique : les bases",
    subtitle: "Chandeliers, tendances, supports et volumes",
    description:
      "Lire des chandeliers japonais et leurs figures, identifier une tendance, tracer supports et résistances, interpréter les volumes et choisir son unité de temps.",
    icon: "CandlestickChart",
    chapters: [
      {
        slug: "chandeliers-japonais",
        order: 1,
        title: "Chandeliers japonais",
        sections: ["01-chandeliers-japonais"],
      },
      {
        slug: "figures-chandeliers",
        order: 2,
        title: "Figures de chandeliers",
        sections: ["02-figures-chandeliers"],
      },
      {
        slug: "tendances-supports-resistances",
        order: 3,
        title: "Tendances, supports et résistances",
        sections: ["03-tendances-supports-resistances"],
      },
      { slug: "volumes", order: 4, title: "Volumes", sections: ["04-volumes"] },
      {
        slug: "unites-de-temps",
        order: 5,
        title: "Unités de temps",
        sections: ["05-unites-de-temps"],
      },
    ],
  },
  {
    slug: "m6-analyse-technique-indicateurs",
    order: 6,
    title: "Analyse technique : indicateurs",
    subtitle: "Moyennes mobiles, oscillateurs et figures chartistes",
    description:
      "Moyennes mobiles, RSI et MACD, bandes de Bollinger, figures chartistes, théorie de Dow, et surtout les limites de l'analyse technique.",
    icon: "Activity",
    chapters: [
      {
        slug: "moyennes-mobiles",
        order: 1,
        title: "Moyennes mobiles",
        sections: ["01-moyennes-mobiles"],
      },
      {
        slug: "rsi-macd",
        order: 2,
        title: "RSI et MACD",
        sections: ["02-rsi-macd"],
      },
      {
        slug: "bandes-bollinger",
        order: 3,
        title: "Bandes de Bollinger",
        sections: ["03-bandes-bollinger"],
      },
      {
        slug: "figures-chartistes",
        order: 4,
        title: "Figures chartistes",
        sections: ["04-figures-chartistes"],
      },
      {
        slug: "theorie-de-dow",
        order: 5,
        title: "Théorie de Dow",
        sections: ["05-theorie-de-dow"],
      },
      {
        slug: "limites-analyse-technique",
        order: 6,
        title: "Limites de l'analyse technique",
        sections: ["06-limites-analyse-technique"],
      },
    ],
  },
  // Bloc 3 — Méthode
  {
    slug: "m7-gestion-du-risque",
    order: 7,
    title: "Gestion du risque",
    subtitle: "Combien risquer, et comment survivre",
    description:
      "Risque par trade et stop-loss, taille de position, ratio risque/rendement, espérance d'une stratégie, drawdown et risque de ruine, corrélation et diversification.",
    icon: "ShieldAlert",
    chapters: [
      {
        slug: "risque-par-trade-stop",
        order: 1,
        title: "Risque par trade et stop-loss",
        sections: ["01-risque-par-trade-stop"],
      },
      {
        slug: "taille-de-position",
        order: 2,
        title: "Taille de position",
        sections: ["02-taille-de-position"],
      },
      {
        slug: "ratio-risque-rendement",
        order: 3,
        title: "Ratio risque/rendement",
        sections: ["03-ratio-risque-rendement"],
      },
      {
        slug: "esperance-strategie",
        order: 4,
        title: "Espérance d'une stratégie",
        sections: ["04-esperance-strategie"],
      },
      {
        slug: "drawdown-ruine",
        order: 5,
        title: "Drawdown et risque de ruine",
        sections: ["05-drawdown-ruine"],
      },
      {
        slug: "correlation-diversification",
        order: 6,
        title: "Corrélation et diversification",
        sections: ["06-correlation-diversification"],
      },
    ],
  },
  {
    slug: "m8-psychologie-plan",
    order: 8,
    title: "Psychologie et plan de trading",
    subtitle: "Biais, discipline, plan et journal",
    description:
      "Reconnaître ses biais cognitifs, garder la discipline face aux émotions, rédiger un plan de trading, tenir un journal et passer du compte démo au compte réel.",
    icon: "Brain",
    chapters: [
      {
        slug: "biais-cognitifs",
        order: 1,
        title: "Biais cognitifs",
        sections: ["01-biais-cognitifs"],
      },
      {
        slug: "discipline-emotions",
        order: 2,
        title: "Discipline et émotions",
        sections: ["02-discipline-emotions"],
      },
      {
        slug: "plan-de-trading",
        order: 3,
        title: "Rédiger son plan de trading",
        sections: ["03-plan-de-trading"],
      },
      {
        slug: "journal-de-trading",
        order: 4,
        title: "Tenir un journal",
        sections: ["04-journal-de-trading"],
      },
      {
        slug: "demo-vers-reel",
        order: 5,
        title: "Du compte démo au compte réel",
        sections: ["05-demo-vers-reel"],
      },
    ],
  },
  {
    slug: "m9-theorie-financiere",
    order: 9,
    title: "Ce que dit la théorie",
    subtitle: "Risque, portefeuille, CAPM et efficience",
    description:
      "Le lien entre risque et rendement, la théorie du portefeuille, le CAPM, l'efficience des marchés et les raisons pour lesquelles la plupart des particuliers perdent.",
    icon: "GraduationCap",
    chapters: [
      {
        slug: "risque-et-rendement",
        order: 1,
        title: "Risque et rendement",
        sections: ["01-risque-et-rendement"],
      },
      {
        slug: "theorie-du-portefeuille",
        order: 2,
        title: "Théorie du portefeuille",
        sections: ["02-theorie-du-portefeuille"],
      },
      { slug: "capm", order: 3, title: "CAPM", sections: ["03-capm"] },
      {
        slug: "efficience-des-marches",
        order: 4,
        title: "Efficience des marchés",
        sections: ["04-efficience-des-marches"],
      },
      {
        slug: "pourquoi-particuliers-perdent",
        order: 5,
        title: "Pourquoi la plupart des particuliers perdent",
        sections: ["05-pourquoi-particuliers-perdent"],
      },
    ],
  },
  {
    slug: "m10-systemes-de-trading",
    order: 10,
    title: "Systèmes de trading",
    subtitle: "Des règles écrites, testées à la main",
    description:
      "Anatomie d'un système (logique, paramètres, sortie, décision), stratégie momentum, pair trading, règles d'entrée et de sortie, et test d'un système à la main.",
    icon: "Cog",
    chapters: [
      {
        slug: "anatomie-systeme",
        order: 1,
        title: "Anatomie d'un système",
        sections: ["01-anatomie-systeme"],
      },
      {
        slug: "strategie-momentum",
        order: 2,
        title: "Stratégie momentum",
        sections: ["02-strategie-momentum"],
      },
      {
        slug: "pair-trading",
        order: 3,
        title: "Pair trading",
        sections: ["03-pair-trading"],
      },
      {
        slug: "regles-entree-sortie",
        order: 4,
        title: "Règles d'entrée et de sortie",
        sections: ["04-regles-entree-sortie"],
      },
      {
        slug: "tester-a-la-main",
        order: 5,
        title: "Tester un système à la main",
        sections: ["05-tester-a-la-main"],
      },
    ],
  },
  // Bloc 4 — Automatisation
  {
    slug: "m11-python-finance",
    order: 11,
    title: "Python pour la finance",
    subtitle: "pandas, rendements et indicateurs",
    description:
      "Manipuler des données OHLC avec pandas, calculer rendements et statistiques, coder des indicateurs et tracer des graphiques de cours.",
    icon: "Code",
    chapters: [
      {
        slug: "pandas-ohlc",
        order: 1,
        title: "pandas et données OHLC",
        sections: ["01-pandas-ohlc"],
      },
      {
        slug: "rendements-statistiques",
        order: 2,
        title: "Rendements et statistiques",
        sections: ["02-rendements-statistiques"],
      },
      {
        slug: "calcul-indicateurs",
        order: 3,
        title: "Calcul d'indicateurs",
        sections: ["03-calcul-indicateurs"],
      },
      {
        slug: "graphiques-de-cours",
        order: 4,
        title: "Graphiques de cours",
        sections: ["04-graphiques-de-cours"],
      },
    ],
  },
  {
    slug: "m12-backtest",
    order: 12,
    title: "Backtester et évaluer",
    subtitle: "Simuler, mesurer, se méfier des biais",
    description:
      "Simuler un portefeuille, mesurer rendement cumulé, volatilité et ratio de Sharpe, écrire un backtest, éviter les biais (look-ahead, survivant, surapprentissage) et intégrer frais et slippage.",
    icon: "History",
    chapters: [
      {
        slug: "simuler-portefeuille",
        order: 1,
        title: "Simuler un portefeuille",
        sections: ["01-simuler-portefeuille"],
      },
      {
        slug: "metriques-performance",
        order: 2,
        title: "Rendement cumulé, volatilité et Sharpe",
        sections: ["02-metriques-performance"],
      },
      {
        slug: "ecrire-un-backtest",
        order: 3,
        title: "Écrire un backtest",
        sections: ["03-ecrire-un-backtest"],
      },
      {
        slug: "biais-de-backtest",
        order: 4,
        title: "Biais : look-ahead, survivant, surapprentissage",
        sections: ["04-biais-de-backtest"],
      },
      {
        slug: "frais-slippage",
        order: 5,
        title: "Frais et slippage",
        sections: ["05-frais-slippage"],
      },
    ],
  },
  {
    slug: "m13-machine-learning",
    order: 13,
    title: "Machine learning pour le trading",
    subtitle: "Modèles prédictifs et leurs limites",
    description:
      "Régression linéaire, KNN et arbres de régression, apprentissage par renforcement (Q-learning), et pourquoi les modèles échouent sur les marchés.",
    icon: "Cpu",
    chapters: [
      {
        slug: "regression-lineaire",
        order: 1,
        title: "Régression linéaire",
        sections: ["01-regression-lineaire"],
      },
      {
        slug: "knn-arbres",
        order: 2,
        title: "KNN et arbres de régression",
        sections: ["02-knn-arbres"],
      },
      {
        slug: "q-learning",
        order: 3,
        title: "Apprentissage par renforcement (Q-learning)",
        sections: ["03-q-learning"],
      },
      {
        slug: "echec-des-modeles",
        order: 4,
        title: "Pourquoi les modèles échouent",
        sections: ["04-echec-des-modeles"],
      },
    ],
  },
  {
    slug: "m14-du-backtest-au-bot",
    order: 14,
    title: "Du backtest au bot",
    subtitle: "Paper trading, API et garde-fous",
    description:
      "Passer par le paper trading, utiliser l'API d'un courtier ou d'une plateforme, sécuriser ses clés API et poser des garde-fous : limites, arrêt d'urgence, surveillance.",
    icon: "Bot",
    chapters: [
      {
        slug: "paper-trading",
        order: 1,
        title: "Paper trading",
        sections: ["01-paper-trading"],
      },
      {
        slug: "api-courtier",
        order: 2,
        title: "API d'un courtier ou d'une plateforme",
        sections: ["02-api-courtier"],
      },
      {
        slug: "securite-cles-api",
        order: 3,
        title: "Sécurité des clés API",
        sections: ["03-securite-cles-api"],
      },
      {
        slug: "garde-fous",
        order: 4,
        title: "Garde-fous : limites, arrêt d'urgence, surveillance",
        sections: ["04-garde-fous"],
      },
    ],
  },
  // Bloc 5 — Certification
  {
    slug: "m15-certification-amf",
    order: 15,
    title: "Préparation à la certification AMF",
    subtitle: "Les 12 thèmes officiels de l'examen",
    description:
      "Un chapitre par thème officiel de l'examen AMF : relations clients, gestion collective, instruments, cadre réglementaire, marchés, déontologie, commercialisation, comptabilité, sécurité financière, post-marché, abus de marché et opérations sur titres.",
    icon: "BadgeCheck",
    chapters: [
      {
        slug: "amf-relations-clients",
        order: 1,
        title: "Relations avec les clients",
        sections: ["01-amf-relations-clients"],
      },
      {
        slug: "amf-gestion-collective",
        order: 2,
        title: "Gestion collective et gestion pour compte de tiers",
        sections: ["02-amf-gestion-collective"],
      },
      {
        slug: "amf-instruments-crypto",
        order: 3,
        title: "Instruments financiers, crypto-actifs et leurs risques",
        sections: ["03-amf-instruments-crypto"],
      },
      {
        slug: "amf-cadre-reglementaire",
        order: 4,
        title: "Cadre institutionnel et réglementaire",
        sections: ["04-amf-cadre-reglementaire"],
      },
      {
        slug: "amf-marches",
        order: 5,
        title: "Fonctionnement et organisation des marchés",
        sections: ["05-amf-marches"],
      },
      {
        slug: "amf-deontologie",
        order: 6,
        title: "Déontologie, conformité et organisation déontologique",
        sections: ["06-amf-deontologie"],
      },
      {
        slug: "amf-commercialisation",
        order: 7,
        title: "Commercialisation, démarchage, vente à distance et conseil",
        sections: ["07-amf-commercialisation"],
      },
      {
        slug: "amf-bases-comptables",
        order: 8,
        title: "Bases comptables et financières",
        sections: ["08-amf-bases-comptables"],
      },
      {
        slug: "amf-securite-financiere",
        order: 9,
        title: "Sécurité financière",
        sections: ["09-amf-securite-financiere"],
      },
      {
        slug: "amf-post-marche",
        order: 10,
        title: "Post-marché et infrastructures de marché",
        sections: ["10-amf-post-marche"],
      },
      {
        slug: "amf-abus-de-marche",
        order: 11,
        title: "Réglementation « abus de marché »",
        sections: ["11-amf-abus-de-marche"],
      },
      {
        slug: "amf-emissions-titres",
        order: 12,
        title: "Émissions et opérations sur titres",
        sections: ["12-amf-emissions-titres"],
      },
    ],
  },
]
