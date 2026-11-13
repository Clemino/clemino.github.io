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
    slug: "m1-systeme-processus", order: 1, title: "Système & Processus",
    subtitle: "Le rôle de l'OS, la création et la synchronisation des processus.",
    description: "Comprendre le rôle du système d'exploitation et le modèle de processus UNIX : création par fork(), recouvrement par exec(), synchronisation par wait(), et gestion de la terminaison.",
    icon: "Cpu",
    chapters: [
      { slug: "os-role", order: 1, title: "Rôle d'un système d'exploitation", summary: "Vue d'ensemble des responsabilités du noyau UNIX.", sections: ["01-os-role"] },
      { slug: "processus-pid", order: 2, title: "Processus, PID et espace d'adressage", summary: "Structure d'un processus UNIX et son identifiant.", sections: ["02-processus-pid"] },
      { slug: "fork", order: 3, title: "Création de processus : fork()", summary: "Duplication d'un processus par l'appel système fork().", sections: ["03-fork"] },
      { slug: "exec-wait", order: 4, title: "Recouvrement (exec) et attente (wait/waitpid)", summary: "Remplacer l'image d'un processus et synchroniser parent/enfant.", sections: ["04-exec-wait"] },
      { slug: "zombies-orphelins", order: 5, title: "Processus zombies et orphelins", summary: "Gestion des processus terminés non récupérés par leur parent.", sections: ["05-zombies-orphelins"] },
    ],
  },
  {
    slug: "m2-signaux", order: 2, title: "Signaux",
    subtitle: "Communication asynchrone : envoyer, capturer et traiter les signaux.",
    description: "Les signaux comme mécanisme de communication asynchrone entre processus : émission, gestionnaires, sigaction(), masquage et attente.",
    icon: "Zap",
    chapters: [
      { slug: "signaux-notion", order: 1, title: "Notion de signal et signaux standard", summary: "Introduction aux signaux POSIX et aux signaux les plus courants.", sections: ["01-signaux-notion"] },
      { slug: "kill-raise-alarm", order: 2, title: "Émettre un signal : kill, raise, alarm", summary: "Fonctions d'envoi de signaux depuis un processus.", sections: ["02-kill-raise-alarm"] },
      { slug: "handlers-sigaction", order: 3, title: "Capturer un signal : signal, sigaction", summary: "Définir des gestionnaires de signaux avec sigaction().", sections: ["03-handlers-sigaction"] },
      { slug: "masquage-attente", order: 4, title: "Masquage et attente de signaux", summary: "Bloquer et attendre des signaux avec sigprocmask et sigsuspend.", sections: ["04-masquage-attente"] },
    ],
  },
  {
    slug: "m3-tubes-anonymes", order: 3, title: "Tubes anonymes",
    subtitle: "IPC sur une même machine : pipes anonymes et redirections.",
    description: "La communication entre processus apparentés via les tubes anonymes : création, redirection des descripteurs et chaînage de processus.",
    icon: "GitCommitHorizontal",
    chapters: [
      { slug: "tubes-notion", order: 1, title: "Notion de tube et lectures destructrices", summary: "Concept de pipe UNIX et caractère destructeur de la lecture.", sections: ["01-tubes-notion"] },
      { slug: "pipe-fork", order: 2, title: "pipe() et fork() : communication parent/enfant", summary: "Créer un pipe avant fork() pour relier parent et enfant.", sections: ["02-pipe-fork"] },
      { slug: "redirections", order: 3, title: "dup/dup2 et redirection des descripteurs", summary: "Rediriger stdin/stdout via duplication de descripteurs.", sections: ["03-redirections"] },
      { slug: "pipeline", order: 4, title: "Chaîner des processus (pipeline)", summary: "Construire un pipeline de commandes reliées par des pipes.", sections: ["04-pipeline"] },
    ],
  },
  {
    slug: "m4-tubes-nommes", order: 4, title: "Tubes nommés (FIFO)",
    subtitle: "Communication entre processus non apparentés via FIFO.",
    description: "Les tubes nommés (FIFO) pour faire communiquer des processus indépendants selon un schéma client/serveur.",
    icon: "Share2",
    chapters: [
      { slug: "fifo-mkfifo", order: 1, title: "Tube nommé et mkfifo", summary: "Créer un tube nommé dans le système de fichiers.", sections: ["01-fifo-mkfifo"] },
      { slug: "fifo-ouverture", order: 2, title: "Ouverture, blocage et sens de communication", summary: "Comportement bloquant à l'ouverture d'un FIFO.", sections: ["02-fifo-ouverture"] },
      { slug: "fifo-client-serveur", order: 3, title: "Schéma client/serveur avec FIFO", summary: "Implémenter un échange requête/réponse via deux FIFOs.", sections: ["03-fifo-client-serveur"] },
    ],
  },
  {
    slug: "m5-threads-synchronisation", order: 5, title: "Threads POSIX & Synchronisation",
    subtitle: "Multi-threading et synchronisation : mutex, conditions, sémaphores.",
    description: "La programmation multi-thread POSIX et la synchronisation : conditions de course, mutex, variables de condition et sémaphores.",
    icon: "Workflow",
    chapters: [
      { slug: "threads-notion", order: 1, title: "Processus vs thread : pthread_create et pthread_join", summary: "Créer et attendre des threads POSIX.", sections: ["01-threads-notion"] },
      { slug: "partage-donnees", order: 2, title: "Données partagées et conditions de course", summary: "Comprendre les accès concurrents et les race conditions.", sections: ["02-partage-donnees"] },
      { slug: "mutex", order: 3, title: "Exclusion mutuelle : pthread_mutex", summary: "Protéger les sections critiques avec un verrou mutex.", sections: ["03-mutex"] },
      { slug: "conditions", order: 4, title: "Variables de condition : pthread_cond", summary: "Synchroniser des threads via des variables de condition.", sections: ["04-conditions"] },
      { slug: "semaphores-posix", order: 5, title: "Sémaphores POSIX", summary: "Contrôle d'accès à des ressources partagées par sémaphores.", sections: ["05-semaphores-posix"] },
    ],
  },
  {
    slug: "m6-ipc-systemev", order: 6, title: "IPC System V & Files de messages",
    subtitle: "IPC System V : clés, sémaphores, files de messages, mémoire partagée.",
    description: "Les mécanismes IPC System V : clés, sémaphores, files de messages et segments de mémoire partagée.",
    icon: "Boxes",
    chapters: [
      { slug: "ipc-cles-ftok", order: 1, title: "Mécanisme IPC System V : clés et ftok", summary: "Générer des clés IPC avec ftok() et identifier les ressources.", sections: ["01-ipc-cles-ftok"] },
      { slug: "semaphores-systemev", order: 2, title: "Sémaphores System V", summary: "Créer et manipuler des sémaphores System V avec semget/semop.", sections: ["02-semaphores-systemev"] },
      { slug: "files-messages", order: 3, title: "Files de messages", summary: "Échanger des messages typés avec msgsnd et msgrcv.", sections: ["03-files-messages"] },
      { slug: "memoire-partagee", order: 4, title: "Mémoire partagée", summary: "Partager un segment mémoire entre processus via shmget/shmat.", sections: ["04-memoire-partagee"] },
    ],
  },
  {
    slug: "m7-sockets-reseau", order: 7, title: "Sockets & Programmation réseau",
    subtitle: "Communication inter-machines : sockets TCP et UDP.",
    description: "La programmation réseau par sockets : modèle client/serveur, protocoles TCP et UDP, adressage et serveurs concurrents.",
    icon: "Network",
    chapters: [
      { slug: "reseau-adressage", order: 1, title: "Modèle client/serveur, adressage et endianness", summary: "Notions de base réseau : adresses IP, ports et ordre des octets.", sections: ["01-reseau-adressage"] },
      { slug: "tcp-serveur", order: 2, title: "Socket TCP côté serveur", summary: "Créer un serveur TCP avec socket, bind, listen et accept.", sections: ["02-tcp-serveur"] },
      { slug: "tcp-client", order: 3, title: "Socket TCP côté client", summary: "Se connecter à un serveur TCP avec connect.", sections: ["03-tcp-client"] },
      { slug: "udp", order: 4, title: "Socket UDP (mode non connecté)", summary: "Échange de datagrammes avec sendto et recvfrom.", sections: ["04-udp"] },
      { slug: "serveur-multi-clients", order: 5, title: "Serveur concurrent (un processus par client)", summary: "Gérer plusieurs clients simultanés par fork après accept.", sections: ["05-serveur-multi-clients"] },
    ],
  },
]
