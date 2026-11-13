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
    slug: "se1-introduction", order: 1, title: "Introduction au C++",
    subtitle: "Du C/Java aux objets : classes, références, fonctions",
    description: "Premiers pas en C++ : compilation g++, flux d'E/S, références et const, surcharge de fonctions, première classe et séparation header/implémentation.",
    icon: "Rocket",
    chapters: [
      { slug: "du-c-au-cpp", order: 1, title: "Du C/Java au C++", sections: ["01-du-c-au-cpp"] },
      { slug: "types-references", order: 2, title: "Types, références et const", sections: ["02-types-references"] },
      { slug: "fonctions", order: 3, title: "Fonctions : surcharge et défauts", sections: ["03-fonctions"] },
      { slug: "classes-objets", order: 4, title: "Classes et objets", sections: ["04-classes-objets"] },
    ],
  },
  {
    slug: "se2-constructeurs-destructeurs", order: 2, title: "Constructeurs & Destructeurs",
    subtitle: "Cycle de vie des objets et gestion mémoire",
    description: "Constructeurs (défaut, paramétrés, liste d'initialisation), destructeur, allocation dynamique new/delete, constructeur de copie, operator= et copie profonde.",
    icon: "Wrench",
    chapters: [
      { slug: "constructeurs", order: 1, title: "Constructeurs", sections: ["01-constructeurs"] },
      { slug: "destructeur", order: 2, title: "Destructeur et cycle de vie", sections: ["02-destructeur"] },
      { slug: "allocation-dynamique", order: 3, title: "Allocation dynamique", sections: ["03-allocation-dynamique"] },
      { slug: "copie-affectation", order: 4, title: "Constructeur de copie et operator=", sections: ["04-copie-affectation"] },
    ],
  },
  {
    slug: "se3-surcharge-operateurs", order: 3, title: "Surcharge d'opérateurs",
    subtitle: "Donner du sens aux opérateurs sur ses classes",
    description: "Principe de la surcharge, opérateurs arithmétiques, opérateurs de comparaison, fonction membre vs fonction amie, surcharge des flux << et >>.",
    icon: "Plus",
    chapters: [
      { slug: "principe-surcharge", order: 1, title: "Principe de la surcharge", sections: ["01-principe-surcharge"] },
      { slug: "operateurs-arithmetiques", order: 2, title: "Opérateurs arithmétiques", sections: ["02-operateurs-arithmetiques"] },
      { slug: "comparaison-membre-amie", order: 3, title: "Comparaison, membre vs amie", sections: ["03-comparaison-membre-amie"] },
      { slug: "surcharge-flux", order: 4, title: "Surcharge des flux", sections: ["04-surcharge-flux"] },
    ],
  },
  {
    slug: "se4-heritage-polymorphisme", order: 4, title: "Héritage & Polymorphisme",
    subtitle: "Réutilisation et liaison dynamique",
    description: "Héritage et relation est-un, redéfinition, méthodes virtuelles, override/final, classes abstraites et méthodes virtuelles pures, collections polymorphes.",
    icon: "Network",
    chapters: [
      { slug: "heritage", order: 1, title: "Héritage", sections: ["01-heritage"] },
      { slug: "redefinition-virtual", order: 2, title: "Redéfinition et virtual", sections: ["02-redefinition-virtual"] },
      { slug: "classes-abstraites", order: 3, title: "Classes abstraites", sections: ["03-classes-abstraites"] },
      { slug: "polymorphisme-collections", order: 4, title: "Polymorphisme et collections", sections: ["04-polymorphisme-collections"] },
    ],
  },
  {
    slug: "se5-flux-io", order: 5, title: "Flux & Gestion des fichiers",
    subtitle: "Entrées/sorties et persistance",
    description: "Flux standard cin/cout/cerr, fichiers fstream, modes d'ouverture, états du flux, positionnement, sérialisation d'objets.",
    icon: "FileText",
    chapters: [
      { slug: "flux-standard", order: 1, title: "Flux standard", sections: ["01-flux-standard"] },
      { slug: "fichiers-fstream", order: 2, title: "Fichiers : fstream", sections: ["02-fichiers-fstream"] },
      { slug: "etats-positionnement", order: 3, title: "États du flux et positionnement", sections: ["03-etats-positionnement"] },
      { slug: "serialisation", order: 4, title: "Sérialisation d'objets", sections: ["04-serialisation"] },
    ],
  },
  {
    slug: "se6-exceptions", order: 6, title: "Gestion des exceptions",
    subtitle: "Détecter et traiter les erreurs",
    description: "try/catch/throw, sélection du catch par type, propagation dans la pile d'appels, relancer une exception, exceptions personnalisées, std::exception et what().",
    icon: "TriangleAlert",
    chapters: [
      { slug: "try-catch-throw", order: 1, title: "try, catch, throw", sections: ["01-try-catch-throw"] },
      { slug: "propagation", order: 2, title: "Propagation et sélection du catch", sections: ["02-propagation"] },
      { slug: "exceptions-personnalisees", order: 3, title: "Exceptions personnalisées", sections: ["03-exceptions-personnalisees"] },
      { slug: "std-exception", order: 4, title: "std::exception et hiérarchie", sections: ["04-std-exception"] },
    ],
  },
  {
    slug: "se7-templates-stl", order: 7, title: "Templates & STL",
    subtitle: "Programmation générique",
    description: "Fonctions et classes templates, instanciation, conteneurs STL (vector, list, map, priority_queue), itérateurs, algorithmes et foncteurs.",
    icon: "Boxes",
    chapters: [
      { slug: "fonctions-templates", order: 1, title: "Fonctions templates", sections: ["01-fonctions-templates"] },
      { slug: "classes-templates", order: 2, title: "Classes templates", sections: ["02-classes-templates"] },
      { slug: "conteneurs-stl", order: 3, title: "Conteneurs STL", sections: ["03-conteneurs-stl"] },
      { slug: "iterateurs", order: 4, title: "Itérateurs", sections: ["04-iterateurs"] },
      { slug: "algorithmes-foncteurs", order: 5, title: "Algorithmes et foncteurs", sections: ["05-algorithmes-foncteurs"] },
    ],
  },
]
