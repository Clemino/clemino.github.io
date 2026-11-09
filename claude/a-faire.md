# Ce qui reste à faire sur le site

État au 9 novembre 2026. Cocher ou retirer un point une fois fait.

## En attente d'une réponse de Clément

- [ ] **Ajouter des proches à la liste de test Google.** L'appli Google reste en mode Test, comme Clément l'a décidé le 9 novembre 2026 : seuls les comptes de sa liste peuvent se connecter, donc ouvrir un cours. Il faut leurs adresses Gmail exactes, à ajouter dans la [console Google, page Audience](https://console.cloud.google.com/auth/audience?project=cours-513918), bouton **Add users** (100 personnes maximum). À la première connexion, Google affiche « Google n'a pas validé cette application » : il faut cliquer sur **Continuer**.
- [ ] **Supprimer le dépôt privé `Clemino/coursapp`.** Décidé par Clément le 9 novembre 2026 : `coursapp` reste uniquement sur son PC. Claude n'a pas le droit de supprimer un dépôt, donc Clément le fait lui-même sur github.com : **Settings**, tout en bas **Delete this repository**, puis taper `Clemino/coursapp`. C'est définitif.

## Site

- [ ] **Terminer la page d'accueil** (`index.html`, encore un brouillon). Elle mène directement à `/trd/` et `/admin/`, qui demandent maintenant de se connecter : elle devrait plutôt mener à `/cours/`. IA responsable n'y figure pas.
- [ ] **Chacun ne voit que ses matières.** Règle voulue par Clément : une personne ne voit que les matières qu'elle a proposées et que Clément a acceptées ; Clément, lui, voit tout. Aujourd'hui, chacun voit toute la bibliothèque et suit ce qu'il veut. À prévoir :
  - relier chaque matière créée à la personne qui l'a proposée : la table `course_proposals` garde déjà `user_id` et `course_id` ;
  - une table des accès par personne, protégée par des règles Supabase, et un moyen de reconnaître Clément comme administrateur (par l'identifiant de son compte) ;
  - permettre à Clément de donner une matière à quelqu'un : Droit administratif et Trading n'ont été proposés par personne, et Océane doit pouvoir voir Droit administratif ;
  - filtrer la bibliothèque, et le contrôle d'accès des cours (`coursapp/lib/access.ts`), sur ces accès plutôt que sur les matières suivies.

  Ce contrôle se fait dans le navigateur : les fichiers publiés sur GitHub Pages restent lisibles par qui connaît leur adresse.
- [ ] **Refaire l'interface de la bibliothèque** (`cours/index.html`) : les boutons, le formulaire « Proposer une matière », la liste « Mes propositions » et tout ce qui a été ajouté autour. Clément les trouve peu réussis. Garder la direction artistique des cours.
- [ ] **Compléter Trading :** 18 sections de théorie rédigées sur 83 prévues ; les modules 4 à 15 sont presque vides. Le contenu se trouve dans `coursapp/courses/trd/`, puis se publie avec `pnpm publish:course trd`.
- [ ] **Ajouter les ateliers d'IA responsable** (diapositives 18, 27 et 34), si leurs documents sont disponibles : le PDF ne contient que leurs titres.

## Entretien

- [x] **Supprimer les branches déjà fusionnées.** Fait le 9 novembre 2026 : il ne reste que `main`, en local et sur GitHub.
- [x] **Couper la connexion par e-mail dans Supabase.** Fait le 9 novembre 2026 : seul Google permet de se connecter, donc seules les personnes de la liste de test Google peuvent créer un compte.
- [ ] **Tester sur un second appareil** (téléphone, iPad) : se connecter, retrouver ses matières et sa progression.

## Idées pour plus tard

- [ ] **Un chatbot sur le site** qui répond uniquement à partir du cours. En attendant, Claude Code le fait déjà avec [cours.md](cours.md). Une version en ligne demanderait un service d'IA gratuit à tester (Cloudflare Workers AI, par exemple).
- [ ] **Ouvrir le site à tout le monde :** rédiger une page de règles de confidentialité, compléter la page Branding de Google (page d'accueil, confidentialité, domaine `clemino.github.io`), puis publier l'appli Google.
- [ ] **Le nom de domaine `clemi.me`.**
- [ ] **Publier les cinq cours en réserve** dans `coursapp/courses/` : C++, IA, programmation fonctionnelle, système et réseau, TAD. Leurs exercices de code se corrigent soi-même, faute de serveur pour compiler.

## Bon à savoir

- Le site est servi par GitHub Pages depuis `main`. Si un déploiement expire (« Timeout reached »), le relancer avec `gh workflow run static.yml --ref main`, et non « Re-run ».
- Supabase est réveillé deux fois par semaine par `.github/workflows/supabase-keepalive.yml`. GitHub désactive les tâches planifiées après 60 jours sans activité sur le dépôt : il suffit alors de la réactiver dans l'onglet Actions.
