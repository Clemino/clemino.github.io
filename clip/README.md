# Presse-papier sécurisé — `/clip/`

Coller du texte sur le PC, le voir en direct sur le téléphone. Le texte est
chiffré de bout en bout (AES-256-GCM) et passe directement d'un appareil à
l'autre (WebRTC). Aucun serveur ne voit le contenu.

- Sur le PC : ouvrir `/clip/`, un QR code s'affiche.
- Sur le téléphone : scanner le QR code avec l'appareil photo.
- Coller le texte sur le PC → il apparaît sur le téléphone.

## Pourquoi « ça reste bloqué sur Connexion… »

Les deux appareils essaient d'abord de se parler **en direct**. Beaucoup de
réseaux (wifi d'école, d'entreprise, certains opérateurs mobiles) bloquent ces
connexions directes. Dans ce cas, il faut un **relais** : un serveur qui fait
suivre les données chiffrées entre les deux appareils. Le relais ne voit jamais
le texte en clair, seulement du charabia chiffré.

Le relais gratuit qui était intégré n'existe plus. Voici comment brancher le
tien, gratuit, chez Cloudflare. Compter ~10 minutes.

## Mettre en place le relais Cloudflare (gratuit)

### 1. Créer une clé TURN

1. Créer un compte sur <https://dash.cloudflare.com> (gratuit).
2. Dans le menu de gauche : **Realtime** → **TURN**.
3. Cliquer **Create** (ou « Add »), donner un nom (ex. `clip`), valider.
4. Cloudflare affiche deux valeurs. Les copier :
   - **TURN Key ID** (identifiant)
   - **API Token** (jeton secret — ne pas le partager, ne pas le mettre sur GitHub)

### 2. Créer le Worker (le petit relais)

1. Menu de gauche : **Workers & Pages** → **Create** → **Create Worker**.
2. Lui donner un nom, par exemple `clip-turn`. L'adresse sera alors
   `https://clip-turn.<ton-sous-domaine>.workers.dev`. **Noter cette adresse.**
3. Cliquer **Deploy**, puis **Edit code**.
4. Effacer le code d'exemple, coller tout le contenu du fichier
   [`clip/turn/worker.js`](turn/worker.js) de ce dépôt, puis **Deploy**.

### 3. Donner ses réglages au Worker

Dans le Worker : **Settings** → **Variables and Secrets** → ajouter :

| Nom | Valeur | Type |
| --- | --- | --- |
| `TURN_KEY_ID` | la *TURN Key ID* de l'étape 1 | Text |
| `TURN_KEY_API_TOKEN` | l'*API Token* de l'étape 1 | **Secret** (Encrypt) |
| `ALLOWED_ORIGIN` | `https://clemino.github.io` | Text |

Enregistrer (**Deploy** à nouveau si demandé).

### 4. Brancher le site sur le Worker

Deux petites modifications dans ce dépôt :

1. Dans **`clip/app.js`**, remplacer la ligne :
   ```js
   const TURN_ENDPOINT = '';
   ```
   par l'adresse du Worker (étape 2) :
   ```js
   const TURN_ENDPOINT = 'https://clip-turn.ton-sous-domaine.workers.dev';
   ```

2. Si l'adresse du Worker **ne finit pas** par `.workers.dev` (domaine
   personnalisé), ajouter aussi son origine dans la règle `connect-src` de
   **`clip/index.html`**. Si elle finit par `.workers.dev`, il n'y a rien à
   changer : c'est déjà autorisé.

Pousser ces deux fichiers. Après le déploiement GitHub Pages (~1 min),
recharger `/clip/` : la connexion passe maintenant par le relais quand la
liaison directe est bloquée.

## Vérifier que le relais marche

Sur le PC, ouvrir les outils de développement (F12) → onglet **Network**, puis
recharger `/clip/`. Une requête vers l'adresse du Worker doit renvoyer un code
**200** avec une réponse `{"iceServers": …}`. Si elle renvoie 403, vérifier que
`ALLOWED_ORIGIN` correspond exactement à l'adresse du site.

## Sécurité en bref

- Chiffrement de bout en bout AES-256-GCM ; la clé n'existe que dans le QR code
  (fragment `#` de l'URL, jamais envoyé à un serveur).
- Un seul appareil associé ; tout autre appareil présentant le QR est refusé et
  le PC affiche une alerte.
- La clé secrète du relais (`API Token`) reste dans le Worker, côté serveur ;
  le navigateur ne reçoit que des accès temporaires.
- Fermer l'onglet du PC ou « Terminer la session » efface le texte sur le
  téléphone.
- Politique de sécurité (CSP) stricte, aucun script externe. PeerJS 1.5.5 et
  qrcode-generator 1.4.4 sont copiés dans `clip/vendor/`.
