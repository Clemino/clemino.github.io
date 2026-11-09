# clemino.github.io

Site personnel. Domaine prevu : clemi.me

## /clip/ : presse-papier sécurisé PC → téléphone

Ouvrir `/clip/` sur le PC, scanner le QR code avec le téléphone, puis coller du texte : il s'affiche en direct sur le téléphone.

- Liaison directe WebRTC entre les deux appareils ; rien n'est stocké sur un serveur.
- Sur les réseaux qui bloquent les connexions directes (école, entreprise), un relais gratuit sur Cloudflare Workers fait passer le texte chiffré : voir [`clip/README.md`](clip/README.md).
- Chiffrement de bout en bout AES-256-GCM. La clé n'existe que dans le fragment `#` du QR code, que le navigateur n'envoie jamais à un serveur. Le relais PeerJS (`0.peerjs.com`) sert seulement à la mise en relation : il voit un identifiant aléatoire, jamais le texte.
- Un seul appareil associé par défaut : tout autre appareil qui présente le QR code est refusé, et le PC affiche une alerte.
- « Terminer la session » ou la fermeture de l'onglet PC efface le texte sur le téléphone.
- CSP stricte, aucun script externe : PeerJS 1.5.5 et qrcode-generator 1.4.4 sont copiés dans `clip/vendor/`.

## /cours/ : la bibliothèque de cours

Connexion Google, puis choix d'une matière parmi les catégories (Droit, Finance…). Ensuite, chacun ne voit que ses matières dans « Mes cours » et peut en ajouter ou en retirer.

- Pour publier un cours : le générer avec `pnpm publish:course <id>` dans `coursapp`, puis l'ajouter à `LIBRARY` dans `cours/index.html` avec sa catégorie. Ne jamais changer l'`id` d'un cours : les choix enregistrés et la progression pointent dessus.
- La connexion et les cours suivis passent par le projet Supabase `cours` (table `followed_courses`). La session est commune à tout le site, car elle reste dans le navigateur pour `clemino.github.io`.
- Un cours renvoie vers `/cours/` si on n'est pas connecté ou si on ne le suit pas. C'est un contrôle dans le navigateur : les fichiers d'un site GitHub Pages restent publics.
- La page reprend la direction artistique des cours : mêmes couleurs, polices Geist copiées dans `cours/fonts/`, et même choix de thème clair ou sombre.
- supabase-js 2.119.0 est copié dans `cours/vendor/`.

## /cours/sources/ et /claude/ : les sources des cours

- `cours/sources/<id>/` contient les documents d'origine de chaque matière (PDF, notes) et une version texte de chacun, avec des repères `[page N]`. Ils sont publics, comme le reste du site.
- `claude/cours.md` explique à Claude comment répondre à une question de cours, par exemple à partir d'une capture d'écran, en s'appuyant sur ces sources. `CLAUDE.md` y renvoie, pour que Claude Code le lise en ouvrant ce dépôt.

## /trd/ : apprendre le trading

Parcours du niveau zéro jusqu'au bot : marchés, analyse, gestion du risque, backtest, automatisation, certification AMF.

- Site statique généré par l'application `coursapp`. Le dossier `trd/` est un résultat de build : ne pas le modifier à la main.
- La progression se synchronise entre les appareils.

## /admin/ : réviser le droit administratif

Parcours de révision du droit administratif (L2, semestre 1) : service public, police administrative, sources de la légalité, limites et contrôle, avec exercices auto-corrigés, cas pratiques guidés et rédactions avec corrigé type.

- Site statique généré par l'application `coursapp`. Le dossier `admin/` est un résultat de build : ne pas le modifier à la main.
- La progression se synchronise entre les appareils.
- Les corrigés types et les sujets de dissertation sont rédigés pour s'entraîner : ils ne sont pas officiels.
