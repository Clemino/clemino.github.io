# Ce qui reste à faire sur le site

État au 13 novembre 2026. Cocher ou retirer un point une fois fait.

## En attente d'une réponse de Clément

- [x] **Faire publier le moteur dans `site/`.** Fait le 13 novembre 2026 : le moteur et les neuf matières sont dans `moteur/`, et `pnpm publish:course <id>` écrit dans `site/<id>/`.
- [ ] **Mettre la clé secrète de Supabase dans claude.ai/code.** Pour créer une matière depuis claude.ai/code, ajouter à l'environnement un **secret réseau** : **Allowed websites** `fcxrvoloiuicbgbqjoco.supabase.co`, **Header name** `apikey`, préfixe vidé, et pour **Value** la clé de `.env.local`. Le proxy l'ajoute aux requêtes vers Supabase sans qu'elle entre dans la session, et rend Supabase joignable malgré le réseau limité du cloud. Ne pas la mettre dans les variables d'environnement : quiconque utilise l'environnement peut les lire, et cette clé passe outre les règles de Supabase.
- [x] **Lancer `supabase/acces-par-personne.sql` dans Supabase.** Fait par Clément le 10 novembre 2026 : les accès par personne sont actifs, et Clément les gère dans la section « Accès » de la bibliothèque.
- [ ] **Ajouter des proches à la liste de test Google.** L'appli Google reste en mode Test, comme Clément l'a décidé le 9 novembre 2026 : seuls les comptes de sa liste peuvent se connecter, donc ouvrir un cours. Il faut leurs adresses Gmail exactes, à ajouter dans la [console Google, page Audience](https://console.cloud.google.com/auth/audience?project=cours-513918), bouton **Add users** (100 personnes maximum). À la première connexion, Google affiche « Google n'a pas validé cette application » : il faut cliquer sur **Continuer**.
- [x] **Supprimer le dépôt privé `Clemino/coursapp`.** Fait par Clément le 9 novembre 2026 : `coursapp` n'existe plus que sur son PC. Depuis le 13 novembre 2026, il est remplacé par `moteur/` dans ce dépôt.

## Site

- [x] **Régler la page d'accueil** (`site/index.html`). Fait le 9 novembre 2026 : à la demande de Clément, c'est une page blanche. On entre sur le site uniquement par `/cours/`.
- [x] **Chacun ne voit que ses matières.** Fait le 10 novembre 2026 : une personne voit les matières qu'elle a proposées et qui ont été créées, celles qu'elle suivait déjà, et celles que Clément lui donne dans la section « Accès » ; Clément voit tout. `proposals.mjs done` ouvre la matière créée à son auteur. Les cours n'ont pas eu à être republiés : ils vérifient qu'on suit la matière, et Supabase cache celles dont l'accès a été retiré.
- [x] **Refaire l'interface de la bibliothèque** (`site/cours/index.html`). Fait le 9 novembre 2026 : une carte par matière, une carte « + » qui ouvre le formulaire dans une fenêtre, des boutons animés aux couleurs des cours, et « Mes propositions » avec l'état de chacune.
- [ ] **Compléter Trading :** 18 sections de théorie rédigées sur 83 prévues ; les modules 4 à 15 sont presque vides. Le contenu se trouve dans `moteur/courses/trd/`, puis se publie avec `cd moteur && pnpm publish:course trd`.
- [ ] **Ajouter les ateliers d'IA responsable** (diapositives 18, 27 et 34), si leurs documents sont disponibles : le PDF ne contient que leurs titres.

## Bibliothèque (`site/cours/index.html`)

Relevé le 10 novembre 2026 en parcourant le site comme un étudiant.

- [ ] **Dire que l'accès se fait sur invitation.** La page de connexion promet « choisis tes cours dans la bibliothèque », mais un nouveau compte n'a accès à rien et lit « Aucune matière ne t'est encore ouverte ». Une personne absente de la liste de test Google est bloquée par Google, sans explication sur le site. Le dire avant la connexion, avec à qui demander l'accès.
- [ ] **Afficher le titre de la matière créée dans « Mes propositions ».** La liste reprend le titre et la catégorie tels qu'ils ont été saisis (« IA-responsable · informatique »), à côté de la carte « IA responsable · Informatique ».
- [ ] **Ne pas couper les descriptions des cartes.** Celle d'IA responsable s'arrête à « explicabilité,… ». Les titres des cartes ne sont pas non plus à la même hauteur : celui de Trading est plus bas que celui d'IA responsable.
- [ ] **Ajouter une icône d'onglet et une description** à `/cours/` et à la racine : pas de favicon (erreur 404), pas de `<meta name="description">` pour le partage d'un lien.
- [ ] **Ajouter une page 404 au site** (`site/404.html`) : une adresse inconnue affiche celle de GitHub, en anglais.
- [ ] **Dire qui fait le site et comment le contacter.** Ni la bibliothèque ni les « À propos » des cours ne donnent d'auteur ou de contact. La page de confidentialité est déjà prévue dans « Ouvrir le site à tout le monde ».

## Moteur des cours (`moteur/`)

Relevé le 10 novembre 2026. Le moteur est commun aux cours : corriger dans `moteur/`, puis republier chaque cours avec `pnpm publish:course <id>`. Le contenu des cours n'est pas concerné : il vient des documents de chaque matière.

- [ ] **Rendre la navigation utilisable sur téléphone.** À 390 px de large, la barre du haut d'un cours fait 826 px : Révision, Examens blancs, Stats, Réglages, Se déconnecter et le thème sortent de l'écran, sans menu. Sur une page de théorie, il n'y a plus ni barre ni menu.
- [ ] **Un bouton pour changer de thème.** Le thème ne se change qu'avec la touche d (« Appuie sur d » dans Réglages), impossible sans clavier. Le bouton flottant « ⌘ K » affiche un raccourci Mac (Ctrl+K ailleurs) et cache du texte sur téléphone.
- [ ] **Traduire ce qui reste en anglais et retirer le jargon** : « toggle theme », « Press d to toggle theme », « gate » (« débloquer le gate », « gate — » dans Statistiques), « done », « SM-2 spaced repetition », « ease 2.50 · int 0j », « 1 exos ».
- [ ] **Un chapitre vide ne doit pas paraître terminé.** Un chapitre sans théorie ni exercice s'affiche « done », car 0 sur 0 compte comme fini, et le quiz de validation demande de finir des exercices qui n'existent pas (Trading, modules 4 à 15). L'afficher « à venir ».
- [ ] **Décider si le parcours est vraiment verrouillé.** L'accueil promet un « parcours strictement linéaire et verrouillé », mais « Sauter ce module » valide tout sans rien faire, chaque exercice a « Passer et valider », et la page des examens dit « Accès libre » quand l'accueil affiche « Examens blancs : Verrouillé ».
- [ ] **La révision ne doit proposer que ce qui a été vu.** Après une seule section lue, elle affiche 30 notions « à réviser » et 1 « en retard », dont des notions de modules encore verrouillés.
- [ ] **Chercher dans le contenu.** La recherche (Ctrl+K) ne trouve que les titres des modules, chapitres et examens : « Blanco » ne donne rien, alors que l'arrêt est une notion du cours.
- [ ] **Expliquer le renvoi vers `/cours/`.** Ouvrir un cours qu'on ne suit pas l'affiche un instant, puis renvoie à la bibliothèque sans message. Vérifier l'accès avant d'afficher le cours, et dire pourquoi on est renvoyé.
- [ ] **Un titre d'onglet par page.** Les 634 pages de Droit administratif s'appellent toutes « admin.app — Réviser le droit administratif » : l'historique et les favoris sont illisibles. Le nom affiché « admin.app » vient de l'identifiant `admin`, qui ne doit pas changer, et fait penser à une page d'administration.
- [ ] **Ne pas couper la carte « Module courant »** de l'accueil d'un cours : elle affiche « Introduction au ».
- [ ] **Masquer l'identifiant technique des exercices** (« #885fabb1 »), et donner une idée du sujet dans la liste des exercices, qui n'affiche que « Q01 QCM ★1 ».
- [ ] **Pouvoir avancer sans valider.** Le seul bouton en bas d'une théorie est « Compris, suivant », qui marque la section comme comprise. Ajouter « précédent » et « suivant ».
- [x] **Calculer le temps de lecture à partir du texte.** Fait le 13 novembre 2026 : le moteur compte 200 mots par minute, au lieu des durées indiquées à la main, 3 à 8 fois trop longues. Un cours affiche la nouvelle durée une fois republié.

## Entretien

- [x] **Supprimer les branches déjà fusionnées.** Fait le 9 novembre 2026 : il ne reste que `main`, en local et sur GitHub.
- [x] **Couper la connexion par e-mail dans Supabase.** Fait le 9 novembre 2026 : seul Google permet de se connecter, donc seules les personnes de la liste de test Google peuvent créer un compte.
- [ ] **Tester sur un second appareil** (téléphone, iPad) : se connecter, retrouver ses matières et sa progression.

## Idées pour plus tard

- [ ] **Un chatbot sur le site** qui répond uniquement à partir du cours. En attendant, Claude Code le fait déjà avec [questions-de-cours.md](questions-de-cours.md). Une version en ligne demanderait un service d'IA gratuit à tester (Cloudflare Workers AI, par exemple).
- [ ] **Ouvrir le site à tout le monde :** rédiger une page de règles de confidentialité, compléter la page Branding de Google (page d'accueil : `https://clemino.github.io/cours/`, puisque la racine est une page blanche ; confidentialité, domaine `clemino.github.io`), puis publier l'appli Google.
- [ ] **Le nom de domaine `clemi.me`.**
- [ ] **Ne plus envoyer les réponses au navigateur.** La solution de chaque exercice et de chaque examen est dans la page (champ `solution` des fichiers `index.txt`), lisible par qui affiche la source. Peu grave pour s'entraîner ; sans serveur, on peut seulement la rendre moins lisible.
- [ ] **Publier les cinq cours en réserve** dans `moteur/courses/` : C++, IA, programmation fonctionnelle, système et réseau, TAD. Leurs exercices de code se corrigent soi-même, faute de serveur pour compiler. TAD ne passe pas encore `check:content` : 3 solutions de son examen `partiel-2024-25` ne passent pas leur correcteur.

## Bon à savoir

- Le site est servi par GitHub Pages depuis le dossier `site/` de `main`. Si un déploiement expire (« Timeout reached »), le relancer avec `gh workflow run deploy.yml --ref main`, et non « Re-run ».
- Supabase est réveillé deux fois par semaine par `.github/workflows/supabase-keepalive.yml`. GitHub désactive les tâches planifiées après 60 jours sans activité sur le dépôt : il suffit alors de la réactiver dans l'onglet Actions.
