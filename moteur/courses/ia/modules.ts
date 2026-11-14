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
    slug: "m01-introduction-ia",
    order: 1,
    title: "Introduction à l'IA",
    subtitle: "Panorama de l'intelligence artificielle moderne",
    description:
      "Découverte des grandes familles de l'IA, du machine learning classique aux grands modèles de langage. Ce module pose les bases conceptuelles et présente le spectre des applications réelles.",
    icon: "Brain",
    chapters: [
      {
        slug: "qu-est-ce-que-l-ia",
        order: 1,
        title: "Qu'est-ce que l'intelligence artificielle ?",
        sections: ["01-qu-est-ce-que-l-ia"],
      },
      {
        slug: "paysage-de-l-ia",
        order: 2,
        title: "Le paysage de l'IA : du ML aux LLM",
        sections: ["02-paysage-de-l-ia"],
      },
      {
        slug: "applications-et-programmes",
        order: 3,
        title: "Applications et programmes intelligents",
        sections: ["03-applications-et-programmes"],
      },
    ],
  },
  {
    slug: "m02-recherche",
    order: 2,
    title: "Résolution de problèmes & recherche",
    subtitle: "Modéliser et explorer les espaces d'états",
    description:
      "Formalisation des problèmes sous forme d'espace d'états et étude des algorithmes de recherche, de la recherche aveugle aux méthodes informées comme A*.",
    icon: "Route",
    chapters: [
      {
        slug: "formuler-un-probleme",
        order: 1,
        title: "Formuler un problème : espace d'états",
        sections: ["01-formuler-un-probleme"],
      },
      {
        slug: "recherche-aveugle",
        order: 2,
        title: "Recherche aveugle : largeur et profondeur",
        sections: ["02-recherche-aveugle"],
      },
      {
        slug: "heuristiques",
        order: 3,
        title: "Recherche informée et heuristiques",
        sections: ["03-heuristiques"],
      },
      {
        slug: "algorithme-a-star",
        order: 4,
        title: "L'algorithme A*",
        sections: ["04-algorithme-a-star"],
      },
    ],
  },
  {
    slug: "m03-jeux-deux-joueurs",
    order: 3,
    title: "Jeux à deux joueurs",
    subtitle: "Minimax, élagage et fonctions d'évaluation",
    description:
      "Modélisation des jeux à somme nulle par des arbres de jeu, algorithme minimax et optimisation par élagage alpha-bêta, avec conception de fonctions d'évaluation heuristiques.",
    icon: "Swords",
    chapters: [
      {
        slug: "jeux-et-arbres",
        order: 1,
        title: "Jeux à somme nulle et arbres de jeu",
        sections: ["01-jeux-et-arbres"],
      },
      {
        slug: "minimax",
        order: 2,
        title: "L'algorithme minimax",
        sections: ["02-minimax"],
      },
      {
        slug: "elagage-alpha-beta",
        order: 3,
        title: "L'élagage alpha-bêta",
        sections: ["03-elagage-alpha-beta"],
      },
      {
        slug: "fonctions-evaluation",
        order: 4,
        title: "Fonctions d'évaluation",
        sections: ["04-fonctions-evaluation"],
      },
    ],
  },
  {
    slug: "m04-optimisation-stochastique",
    order: 4,
    title: "Optimisation stochastique",
    subtitle: "Recuit simulé et métaheuristiques pour l'exploration",
    description:
      "Approches probabilistes pour résoudre des problèmes d'optimisation combinatoire difficiles, avec le recuit simulé et le critère de Metropolis appliqués au problème du voyageur de commerce.",
    icon: "Dices",
    chapters: [
      {
        slug: "metaheuristiques",
        order: 1,
        title: "Optimisation et métaheuristiques",
        sections: ["01-metaheuristiques"],
      },
      {
        slug: "voyageur-de-commerce",
        order: 2,
        title: "Le problème du voyageur de commerce",
        sections: ["02-voyageur-de-commerce"],
      },
      {
        slug: "recuit-simule",
        order: 3,
        title: "Le recuit simulé",
        sections: ["03-recuit-simule"],
      },
      {
        slug: "critere-de-metropolis",
        order: 4,
        title: "Critère de Metropolis et réglages",
        sections: ["04-critere-de-metropolis"],
      },
    ],
  },
  {
    slug: "m05-data-mining",
    order: 5,
    title: "Data Mining — éléments de base",
    subtitle: "Du processus KDD aux métriques d'évaluation",
    description:
      "Introduction à la fouille de données et au processus KDD, présentation des types d'apprentissage et des tâches, et étude des métriques d'évaluation (matrice de confusion, précision, rappel, F1).",
    icon: "Database",
    chapters: [
      {
        slug: "fouille-de-donnees-kdd",
        order: 1,
        title: "Fouille de données et processus KDD",
        sections: ["01-fouille-de-donnees-kdd"],
      },
      {
        slug: "types-apprentissage",
        order: 2,
        title: "Types d'apprentissage et de tâches",
        sections: ["02-types-apprentissage"],
      },
      {
        slug: "apprentissage-test-surapprentissage",
        order: 3,
        title: "Apprentissage, test et sur-apprentissage",
        sections: ["03-apprentissage-test-surapprentissage"],
      },
      {
        slug: "evaluation-metriques",
        order: 4,
        title: "Évaluation : matrice de confusion et métriques",
        sections: ["04-evaluation-metriques"],
      },
    ],
  },
  {
    slug: "m06-arbres-forets",
    order: 6,
    title: "Arbres de décision & forêts aléatoires",
    subtitle: "Du découpage récursif au bagging et aux forêts",
    description:
      "Construction et élagage des arbres de décision à partir de critères comme l'entropie ou l'impureté de Gini, puis généralisation avec le bagging et les forêts aléatoires pour réduire le sur-apprentissage.",
    icon: "TreeDeciduous",
    chapters: [
      {
        slug: "criteres-decoupage",
        order: 1,
        title: "Arbres de décision et critères de découpage",
        sections: ["01-criteres-decoupage"],
      },
      {
        slug: "construction-elagage",
        order: 2,
        title: "Construction et élagage d'un arbre",
        sections: ["02-construction-elagage"],
      },
      {
        slug: "surapprentissage-arbres",
        order: 3,
        title: "Sur-apprentissage des arbres",
        sections: ["03-surapprentissage-arbres"],
      },
      {
        slug: "bagging-forets",
        order: 4,
        title: "Bagging et forêts aléatoires",
        sections: ["04-bagging-forets"],
      },
      {
        slug: "oob-importance",
        order: 5,
        title: "Erreur OOB et importance des variables",
        sections: ["05-oob-importance"],
      },
    ],
  },
  {
    slug: "m07-bayes-naif",
    order: 7,
    title: "Classifieur bayésien naïf",
    subtitle: "Probabilités conditionnelles et indépendance naïve",
    description:
      "Application du théorème de Bayes à la classification avec l'hypothèse d'indépendance conditionnelle, estimation des probabilités avec lissage de Laplace et prédiction de nouvelles instances.",
    icon: "Sigma",
    chapters: [
      {
        slug: "probabilites-bayes",
        order: 1,
        title: "Probabilités conditionnelles et théorème de Bayes",
        sections: ["01-probabilites-bayes"],
      },
      {
        slug: "classifieur-bayesien-naif",
        order: 2,
        title: "Le classifieur bayésien naïf",
        sections: ["02-classifieur-bayesien-naif"],
      },
      {
        slug: "estimation-lissage",
        order: 3,
        title: "Estimation des probabilités et lissage",
        sections: ["03-estimation-lissage"],
      },
      {
        slug: "prediction-instance",
        order: 4,
        title: "Prédiction d'une nouvelle instance",
        sections: ["04-prediction-instance"],
      },
    ],
  },
  {
    slug: "m08-regression-logistique",
    order: 8,
    title: "Régression logistique",
    subtitle: "Classification linéaire par maximisation de vraisemblance",
    description:
      "De la régression linéaire à la régression logistique via la fonction sigmoïde, interprétation des coefficients par les odds et log-odds, et estimation des paramètres par maximisation de la vraisemblance.",
    icon: "Spline",
    chapters: [
      {
        slug: "de-lineaire-a-logistique",
        order: 1,
        title: "De la régression linéaire à la logistique",
        sections: ["01-de-lineaire-a-logistique"],
      },
      {
        slug: "sigmoide-frontiere",
        order: 2,
        title: "Fonction sigmoïde et frontière de décision",
        sections: ["02-sigmoide-frontiere"],
      },
      {
        slug: "odds-coefficients",
        order: 3,
        title: "Odds, log-odds et interprétation des coefficients",
        sections: ["03-odds-coefficients"],
      },
      {
        slug: "vraisemblance-selection",
        order: 4,
        title: "Vraisemblance et sélection de variables",
        sections: ["04-vraisemblance-selection"],
      },
    ],
  },
  {
    slug: "m09-reseaux-neurones",
    order: 9,
    title: "Réseaux de neurones",
    subtitle: "Du neurone formel à la rétropropagation",
    description:
      "Construction des réseaux de neurones artificiels : neurone formel, fonctions d'activation, perceptron multicouche, propagation avant et rétropropagation du gradient pour l'apprentissage.",
    icon: "Network",
    chapters: [
      {
        slug: "neurone-formel-activations",
        order: 1,
        title: "Le neurone formel et les fonctions d'activation",
        sections: ["01-neurone-formel-activations"],
      },
      {
        slug: "perceptron-multicouche",
        order: 2,
        title: "Perceptron et perceptron multicouche",
        sections: ["02-perceptron-multicouche"],
      },
      {
        slug: "propagation-avant",
        order: 3,
        title: "La propagation avant",
        sections: ["03-propagation-avant"],
      },
      {
        slug: "retropropagation-gradient",
        order: 4,
        title: "Rétropropagation et descente de gradient",
        sections: ["04-retropropagation-gradient"],
      },
      {
        slug: "poids-et-biais",
        order: 5,
        title: "Poids, biais et nombre de paramètres",
        sections: ["05-poids-et-biais"],
      },
    ],
  },
  {
    slug: "m10-deep-learning-cnn",
    order: 10,
    title: "Deep Learning — réseaux convolutifs",
    subtitle: "Convolution, pooling et vision par ordinateur",
    description:
      "Fondements de l'apprentissage profond appliqué aux images : couche de convolution, pooling, architectures CNN et techniques de régularisation pour éviter le sur-apprentissage.",
    icon: "Grid3x3",
    chapters: [
      {
        slug: "apprentissage-profond",
        order: 1,
        title: "L'apprentissage profond",
        sections: ["01-apprentissage-profond"],
      },
      {
        slug: "couche-convolution",
        order: 2,
        title: "La couche de convolution",
        sections: ["02-couche-convolution"],
      },
      {
        slug: "pooling-architecture-cnn",
        order: 3,
        title: "Pooling et architecture d'un CNN",
        sections: ["03-pooling-architecture-cnn"],
      },
      {
        slug: "entrainement-regularisation",
        order: 4,
        title: "Entraînement et régularisation",
        sections: ["04-entrainement-regularisation"],
      },
    ],
  },
  {
    slug: "m11-deep-learning-rnn",
    order: 11,
    title: "Deep Learning — réseaux récurrents",
    subtitle: "Mémoire temporelle, LSTM et ouverture aux transformers",
    description:
      "Traitement des données séquentielles avec les réseaux récurrents : état caché, rétropropagation dans le temps, problème du gradient évanescent, LSTM et GRU, et introduction aux transformers.",
    icon: "Repeat",
    chapters: [
      {
        slug: "donnees-sequentielles-rnn",
        order: 1,
        title: "Données séquentielles et RNN",
        sections: ["01-donnees-sequentielles-rnn"],
      },
      {
        slug: "etat-cache-bptt",
        order: 2,
        title: "État caché et rétropropagation dans le temps",
        sections: ["02-etat-cache-bptt"],
      },
      {
        slug: "lstm-gru",
        order: 3,
        title: "Gradient évanescent, LSTM et GRU",
        sections: ["03-lstm-gru"],
      },
      {
        slug: "applications-rnn-transformers",
        order: 4,
        title: "Applications et ouverture vers les transformers",
        sections: ["04-applications-rnn-transformers"],
      },
    ],
  },
  {
    slug: "m12-apprentissage-renforcement",
    order: 12,
    title: "Apprentissage par renforcement",
    subtitle: "Agents, récompenses et politique optimale",
    description:
      "Cadre formel des processus de décision markoviens, fonctions de valeur, équation de Bellman, et algorithmes d'apprentissage par interaction (value iteration, Q-learning) avec gestion du compromis exploration/exploitation.",
    icon: "Trophy",
    chapters: [
      {
        slug: "cadre-renforcement-mdp",
        order: 1,
        title: "Le cadre du renforcement : processus de décision markovien",
        sections: ["01-cadre-renforcement-mdp"],
      },
      {
        slug: "politique-gain-actualise",
        order: 2,
        title: "Politique, récompense et gain actualisé",
        sections: ["02-politique-gain-actualise"],
      },
      {
        slug: "fonction-valeur-bellman",
        order: 3,
        title: "Fonction de valeur et équation de Bellman",
        sections: ["03-fonction-valeur-bellman"],
      },
      {
        slug: "value-iteration",
        order: 4,
        title: "Value iteration",
        sections: ["04-value-iteration"],
      },
      {
        slug: "q-learning",
        order: 5,
        title: "Q-learning et exploration/exploitation",
        sections: ["05-q-learning"],
      },
    ],
  },
  {
    slug: "m13-nlp",
    order: 13,
    title: "Introduction au NLP",
    subtitle: "Du prétraitement textuel vers les grands modèles",
    description:
      "Fondements du traitement automatique du langage naturel : prétraitement, représentation vectorielle du texte, modèles de langage et plongements lexicaux, et panorama des applications actuelles incluant les LLM.",
    icon: "Languages",
    chapters: [
      {
        slug: "traitement-langage-naturel",
        order: 1,
        title: "Le traitement automatique du langage naturel",
        sections: ["01-traitement-langage-naturel"],
      },
      {
        slug: "pretraitement-representation",
        order: 2,
        title: "Prétraitement et représentation du texte",
        sections: ["02-pretraitement-representation"],
      },
      {
        slug: "modeles-langage-embeddings",
        order: 3,
        title: "Modèles de langage et plongements lexicaux",
        sections: ["03-modeles-langage-embeddings"],
      },
      {
        slug: "applications-nlp-llm",
        order: 4,
        title: "Applications du NLP et vers les LLM",
        sections: ["04-applications-nlp-llm"],
      },
    ],
  },
]
