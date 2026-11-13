# cours.app

Le moteur commun aux cours de clemino.github.io. Chaque cours vit dans `courses/<id>/` ; `COURSE=<id>` choisit celui qui est lu.

```bash
pnpm install
COURSE=cpp pnpm dev
```

L'appli est entièrement statique : le contenu est lu au build. La progression reste dans le navigateur (localStorage) et se synchronise par Supabase. Une fois publié, un cours renvoie vers `/cours/` si on n'est pas connecté ou si on ne le suit pas.

`COURSE=<id> pnpm check:content` vérifie le contenu d'un cours : chaque solution doit passer son correcteur.

## Publier un cours

`pnpm publish:course <id>` construit le cours et le copie dans le dossier `<id>/` du dépôt local `clemino.github.io`. Rien n'est poussé.

## Ajouter un cours

Créer `courses/<id>/` avec `course.ts` (nom, logo, textes), `modules.ts`, `concepts.json`, `exercises/`, `exam/` et `theory/`, puis l'ajouter à `LIBRARY` dans `cours/index.html` du site, avec sa catégorie.

## Exercices de code

Le site n'a pas de serveur pour compiler. `CODE_WRITE` et `CODE_FIX` se corrigent soi-même avec la solution de référence : ils ne comptent ni dans les gates ni dans les examens.
