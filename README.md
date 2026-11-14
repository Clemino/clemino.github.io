# clemino.github.io

Bibliothèque de cours en ligne : on se connecte avec Google, on ouvre les matières qui nous sont ouvertes, et la progression suit sur tous les appareils.

**Site :** https://clemino.github.io/cours/ · Domaine prévu : `clemi.me`

## Organisation

```
site/                   Publié tel quel sur https://clemino.github.io
├── index.html          Page d'accueil, volontairement blanche
├── cours/              Bibliothèque : connexion, matières, propositions, accès
├── admin/              Droit administratif   ┐
├── contrats/           Droit des contrats    │ générés par moteur/ :
├── ia-responsable/     IA responsable        │ ne pas modifier à la main
└── trd/                Trading               ┘
moteur/                 Moteur des cours et contenu de chaque matière (courses/<id>/)
sources/<id>/           Documents d'origine de chaque matière, avec leur version texte
supabase/               Scripts SQL à lancer dans Supabase
scripts/proposals.mjs   Traitement des matières proposées depuis la bibliothèque
docs/                   Consignes pour Claude et liste des choses à faire
.claude/skills/         Skill creer-une-matiere, pour Claude Code
.github/workflows/      Publication du site et réveil de Supabase
```

## Commandes

Depuis `moteur/` :

```bash
pnpm install
COURSE=<id> pnpm dev              # ouvre une matière en local
COURSE=<id> pnpm check:content    # chaque solution passe son correcteur
COURSE=<id> pnpm check:quality    # la matière atteint le niveau d'Admin et de Contrats
COURSE=<id> pnpm test
pnpm publish:course <id>          # écrit la matière dans site/<id>/
```

## Publication

- Chaque push sur `main` publie `site/` avec `.github/workflows/deploy.yml` ; le reste du dépôt n'est pas mis en ligne. Si une publication expire (« Timeout reached »), la relancer avec `gh workflow run deploy.yml --ref main`.
- Une matière se rédige dans `moteur/courses/<id>/`, se publie avec `pnpm publish:course <id>`, puis s'ajoute à `LIBRARY` dans `site/cours/index.html`, avec sa catégorie, la couleur de sa carte et son icône. Le skill `creer-une-matiere` mène tout le parcours, sur le PC comme dans claude.ai/code.
- Ne jamais changer l'`id` d'une matière : les matières suivies, les accès et la progression pointent dessus.

## Cours

| Dossier | Matière |
|---|---|
| `site/admin/` | Droit administratif, L2 semestre 1 : service public, police administrative, sources de la légalité, limites et contrôle. Les corrigés types et les sujets de dissertation servent à s'entraîner : ils ne sont pas officiels. |
| `site/contrats/` | Droit des contrats, L2 semestre 3 : sources de l'obligation, réforme de 2016, conclusion du contrat, vices du consentement, capacité et contenu. Les corrigés types servent à s'entraîner : ils ne sont pas officiels. |
| `site/ia-responsable/` | IA responsable : le dossier de confiance d'un système d'IA, des risques à la décision. |
| `site/trd/` | Trading, du niveau zéro au bot : marchés, analyse, gestion du risque, backtest, automatisation, certification AMF. |

## Bibliothèque

- Chaque matière est une carte : « Mes cours » pour celles qu'on suit, « À découvrir » pour les autres, et une carte « + » pour proposer une matière en envoyant ses PDF. « Mes propositions » montre l'état de chaque proposition.
- Chacun ne voit que les matières qui lui sont ouvertes : celles qu'il a proposées et qui ont été créées, et celles que l'administrateur lui a données. L'administrateur voit tout, et donne ou retire les matières dans la section « Accès », visible de lui seul.
- Un cours renvoie vers `/cours/` si on n'est pas connecté ou si on ne suit pas la matière. C'est un contrôle dans le navigateur : les fichiers publiés sur GitHub Pages restent lisibles par qui connaît leur adresse.
- La page reprend la direction artistique des cours : mêmes couleurs, polices Geist dans `site/cours/fonts/`, même thème clair ou sombre. Les animations s'arrêtent si l'appareil demande moins de mouvements. supabase-js 2.119.0 est copié dans `site/cours/vendor/`.

## Supabase

Projet `cours`, connexion par Google uniquement.

| Table | Contenu |
|---|---|
| `followed_courses` | Matières suivies par chacun |
| `course_access` | Qui peut voir quelle matière |
| `people` | Comptes inscrits, pour la section « Accès » |
| `admins` | Administrateurs |
| `course_proposals` | Matières proposées, avec leurs PDF dans l'espace de stockage privé `proposals` |

- Les règles de Supabase empêchent de suivre une matière sans y avoir accès, et cachent celles dont l'accès a été retiré ; la progression reste enregistrée. Elles sont dans `supabase/acces-par-personne.sql`.
- La clé secrète, qui sert à `scripts/proposals.mjs`, est dans `.env.local` sur le PC (ignoré par git), et dans un secret réseau de l'environnement claude.ai/code. Elle ne doit apparaître nulle part ailleurs.
- `.github/workflows/supabase-keepalive.yml` réveille le projet deux fois par semaine : sans activité, l'offre gratuite le met en pause.

## Claude Code

- `CLAUDE.md` renvoie Claude vers `docs/questions-de-cours.md` pour répondre à une question de cours, vers `docs/a-faire.md` pour ce qui reste à faire, et vers le skill `creer-une-matiere` pour créer une matière proposée.
- `sources/<id>/` garde les documents d'origine de chaque matière et une version texte de chacun, avec des repères `[page N]` pour citer la page.
