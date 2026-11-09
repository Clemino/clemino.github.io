# clemino.github.io

Site personnel. Domaine prevu : clemi.me

La page d'accueil (`index.html`) est une page blanche, voulue ainsi : on entre sur le site par la bibliothèque, https://clemino.github.io/cours/.

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
- Dans la bibliothèque, toute personne connectée peut proposer une matière : un titre, une catégorie et des PDF, gardés dans un espace privé de Supabase. `claude/creer-matiere.md` décrit comment Claude crée ensuite la matière en local, avec `claude/scripts/proposals.mjs` et la clé secrète de Supabase dans `.env.local`, ignoré par git.

## /trd/ : apprendre le trading

Parcours du niveau zéro jusqu'au bot : marchés, analyse, gestion du risque, backtest, automatisation, certification AMF.

- Site statique généré par l'application `coursapp`. Le dossier `trd/` est un résultat de build : ne pas le modifier à la main.
- La progression se synchronise entre les appareils.

## /admin/ : réviser le droit administratif

Parcours de révision du droit administratif (L2, semestre 1) : service public, police administrative, sources de la légalité, limites et contrôle, avec exercices auto-corrigés, cas pratiques guidés et rédactions avec corrigé type.

- Site statique généré par l'application `coursapp`. Le dossier `admin/` est un résultat de build : ne pas le modifier à la main.
- La progression se synchronise entre les appareils.
- Les corrigés types et les sujets de dissertation sont rédigés pour s'entraîner : ils ne sont pas officiels.
