# Ce qui reste à faire sur le site

État au 10 novembre 2026. Cocher ou retirer un point une fois fait.

## En attente d'une réponse de Clément

- [x] **Lancer `claude/supabase/acces-par-personne.sql` dans Supabase.** Fait par Clément le 10 novembre 2026 : les accès par personne sont actifs, et Clément les gère dans la section « Accès » de la bibliothèque.
- [ ] **Ajouter des proches à la liste de test Google.** L'appli Google reste en mode Test, comme Clément l'a décidé le 9 novembre 2026 : seuls les comptes de sa liste peuvent se connecter, donc ouvrir un cours. Il faut leurs adresses Gmail exactes, à ajouter dans la [console Google, page Audience](https://console.cloud.google.com/auth/audience?project=cours-513918), bouton **Add users** (100 personnes maximum). À la première connexion, Google affiche « Google n'a pas validé cette application » : il faut cliquer sur **Continuer**.
- [x] **Supprimer le dépôt privé `Clemino/coursapp`.** Fait par Clément le 9 novembre 2026 : `coursapp` n'existe plus que sur son PC.

## Site

- [x] **Régler la page d'accueil** (`index.html`). Fait le 9 novembre 2026 : à la demande de Clément, c'est une page blanche. On entre sur le site uniquement par `/cours/`.
- [x] **Chacun ne voit que ses matières.** Fait le 10 novembre 2026 : une personne voit les matières qu'elle a proposées et qui ont été créées, celles qu'elle suivait déjà, et celles que Clément lui donne dans la section « Accès » ; Clément voit tout. `proposals.mjs done` ouvre la matière créée à son auteur. Les cours n'ont pas eu à être republiés : ils vérifient qu'on suit la matière, et Supabase cache celles dont l'accès a été retiré.
- [x] **Refaire l'interface de la bibliothèque** (`cours/index.html`). Fait le 9 novembre 2026 : une carte par matière, une carte « + » qui ouvre le formulaire dans une fenêtre, des boutons animés aux couleurs des cours, et « Mes propositions » avec l'état de chacune.
- [ ] **Compléter Trading :** 18 sections de théorie rédigées sur 83 prévues ; les modules 4 à 15 sont presque vides. Le contenu se trouve dans `coursapp/courses/trd/`, puis se publie avec `pnpm publish:course trd`.
- [ ] **Ajouter les ateliers d'IA responsable** (diapositives 18, 27 et 34), si leurs documents sont disponibles : le PDF ne contient que leurs titres.

## Entretien

- [x] **Supprimer les branches déjà fusionnées.** Fait le 9 novembre 2026 : il ne reste que `main`, en local et sur GitHub.
- [x] **Couper la connexion par e-mail dans Supabase.** Fait le 9 novembre 2026 : seul Google permet de se connecter, donc seules les personnes de la liste de test Google peuvent créer un compte.
- [ ] **Tester sur un second appareil** (téléphone, iPad) : se connecter, retrouver ses matières et sa progression.

## Idées pour plus tard

- [ ] **Un chatbot sur le site** qui répond uniquement à partir du cours. En attendant, Claude Code le fait déjà avec [cours.md](cours.md). Une version en ligne demanderait un service d'IA gratuit à tester (Cloudflare Workers AI, par exemple).
- [ ] **Ouvrir le site à tout le monde :** rédiger une page de règles de confidentialité, compléter la page Branding de Google (page d'accueil : `https://clemino.github.io/cours/`, puisque la racine est une page blanche ; confidentialité, domaine `clemino.github.io`), puis publier l'appli Google.
- [ ] **Le nom de domaine `clemi.me`.**
- [ ] **Publier les cinq cours en réserve** dans `coursapp/courses/` : C++, IA, programmation fonctionnelle, système et réseau, TAD. Leurs exercices de code se corrigent soi-même, faute de serveur pour compiler.

## Bon à savoir

- Le site est servi par GitHub Pages depuis `main`. Si un déploiement expire (« Timeout reached »), le relancer avec `gh workflow run static.yml --ref main`, et non « Re-run ».
- Supabase est réveillé deux fois par semaine par `.github/workflows/supabase-keepalive.yml`. GitHub désactive les tâches planifiées après 60 jours sans activité sur le dépôt : il suffit alors de la réactiver dans l'onglet Actions.
