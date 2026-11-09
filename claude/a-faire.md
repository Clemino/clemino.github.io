# Ce qui reste à faire sur le site

État au 9 novembre 2026. Cocher ou retirer un point une fois fait.

## En attente d'une réponse de Clément

- [ ] **Ajouter des proches à la liste de test Google.** L'appli Google est en mode Test : seuls les comptes de sa liste peuvent se connecter, donc ouvrir un cours. Il faut leurs adresses Gmail exactes, à ajouter dans la [console Google, page Audience](https://console.cloud.google.com/auth/audience?project=cours-513918), bouton **Add users** (100 personnes maximum). À la première connexion, Google affiche « Google n'a pas validé cette application » : il faut cliquer sur **Continuer**.
- [ ] **Décider du sort de la copie GitHub de `coursapp`.** Clément veut garder `coursapp` uniquement sur son PC. Une copie a quand même été envoyée dans le dépôt privé `Clemino/coursapp` avant sa décision ; le dossier local n'y est plus relié. La supprimer est définitif et se fait dans Chrome, car l'accès `gh` n'a pas le droit de supprimer un dépôt.

## Site

- [ ] **Terminer la page d'accueil** (`index.html`, encore un brouillon). Elle mène directement à `/trd/` et `/admin/`, qui demandent maintenant de se connecter : elle devrait plutôt mener à `/cours/`. IA responsable n'y figure pas.
- [ ] **Compléter Trading :** 18 sections de théorie rédigées sur 83 prévues ; les modules 4 à 15 sont presque vides. Le contenu se trouve dans `coursapp/courses/trd/`, puis se publie avec `pnpm publish:course trd`.
- [ ] **Ajouter les ateliers d'IA responsable** (diapositives 18, 27 et 34), si leurs documents sont disponibles : le PDF ne contient que leurs titres.

## Entretien

- [ ] **Supprimer les branches déjà fusionnées :** `refonte-site`, `plateforme-cours`, `retire-clip`, `supabase-keepalive` et `a-faire`, en local et sur GitHub, plus l'ancienne `claude/admin-app`.
- [ ] **Couper la connexion par e-mail dans Supabase** (projet `cours`, Authentication > Sign In / Providers > Email). Le site n'utilise que Google ; cela ferme une porte inutile et fait taire l'avertissement « Leaked Password Protection Disabled ».
- [ ] **Tester sur un second appareil** (téléphone, iPad) : se connecter, retrouver ses matières et sa progression.

## Idées pour plus tard

- [ ] **Un chatbot sur le site** qui répond uniquement à partir du cours. En attendant, Claude Code le fait déjà avec [cours.md](cours.md). Une version en ligne demanderait un service d'IA gratuit à tester (Cloudflare Workers AI, par exemple).
- [ ] **Ouvrir le site à tout le monde :** rédiger une page de règles de confidentialité, compléter la page Branding de Google (page d'accueil, confidentialité, domaine `clemino.github.io`), puis publier l'appli Google.
- [ ] **Le nom de domaine `clemi.me`.**
- [ ] **Publier les cinq cours en réserve** dans `coursapp/courses/` : C++, IA, programmation fonctionnelle, système et réseau, TAD. Leurs exercices de code se corrigent soi-même, faute de serveur pour compiler.

## Bon à savoir

- Le site est servi par GitHub Pages depuis `main`. Si un déploiement expire (« Timeout reached »), le relancer avec `gh workflow run static.yml --ref main`, et non « Re-run ».
- Supabase est réveillé deux fois par semaine par `.github/workflows/supabase-keepalive.yml`. GitHub désactive les tâches planifiées après 60 jours sans activité sur le dépôt : il suffit alors de la réactiver dans l'onglet Actions.
