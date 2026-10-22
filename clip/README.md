# Presse-papier sécurisé — `/clip/`

Coller du texte sur le PC, le voir en direct sur le téléphone. Le texte est
chiffré de bout en bout (AES-256-GCM) : aucun serveur ne peut le lire.

- Sur le PC : ouvrir `/clip/`, un QR code s'affiche.
- Sur le téléphone : scanner le QR code avec l'appareil photo.
- Coller le texte sur le PC → il apparaît sur le téléphone.

## Deux modes de connexion

- **Direct (par défaut)** : les deux appareils se parlent en WebRTC, sans
  intermédiaire. Marche sur un réseau ouvert (box perso, même wifi).
- **Relais** : le texte, chiffré, passe par ton propre Cloudflare Worker en
  WebSocket sur le port 443. Nécessaire sur les réseaux qui bloquent les
  connexions directes (wifi d'école ou d'entreprise, certains réseaux mobiles) :
  sinon le téléphone reste bloqué sur « Connexion… ».

## Mettre en place le relais (gratuit, sans carte bancaire)

Le relais tourne sur l'offre gratuite de Cloudflare Workers. Aucune carte
bancaire n'est nécessaire : si un jour le quota gratuit était dépassé, le relais
s'arrêterait simplement jusqu'au lendemain, sans aucune facturation. Pour du
texte, on en est très loin.

Le code du relais est dans [`clip/relay/`](relay/). Cloudflare le déploie
directement depuis ce dépôt GitHub : rien à copier-coller, aucun secret à
configurer.

### 1. Créer le Worker depuis GitHub

1. Sur <https://dash.cloudflare.com>, menu de gauche : **Workers & Pages** →
   **Create**.
2. Choisir **Import a repository** (« Importer un dépôt »), puis se connecter
   avec GitHub et autoriser Cloudflare. Il suffit de lui donner accès au dépôt
   `clemino.github.io`.
3. Sélectionner le dépôt `clemino.github.io`.
4. Réglages du projet :
   - **Project name** : `clip-relay` (doit être exactement ce nom)
   - **Production branch** : `main`
   - **Root directory** (ou *Path*) : laisser vide (racine du dépôt). Le
     fichier [`wrangler.toml`](../wrangler.toml) à la racine indique à
     Cloudflare de déployer le relais de `clip/relay/`.
   - **Build command** : laisser vide
   - **Deploy command** : `npx wrangler deploy` (valeur par défaut)
5. Cliquer **Deploy** et attendre la fin (une à deux minutes).

### 2. Tester le relais

Cloudflare affiche l'adresse du Worker, de la forme
`https://clip-relay.<ton-sous-domaine>.workers.dev`. L'ouvrir dans le
navigateur : la page doit afficher **« Relais du presse-papier sécurisé : OK »**.

### 3. Brancher le site sur le relais

Dans **`clip/app.js`**, remplacer :

```js
const RELAY_URL = '';
```

par l'adresse du Worker, en remplaçant `https://` par `wss://` :

```js
const RELAY_URL = 'wss://clip-relay.ton-sous-domaine.workers.dev';
```

Pousser sur `main`. Après le déploiement GitHub Pages (~1 min), recharger
`/clip/` sur le PC et rescanner le QR code.

## Si ça ne marche pas

- **Le build Cloudflare échoue** : vérifier que le nom du projet est bien
  `clip-relay`.
- **L'adresse du Worker affiche une page blanche ou le site au lieu de
  « Relais … : OK »** : Cloudflare a déployé le dépôt comme site statique.
  Vérifier que le *Root directory* est vide et que la *Deploy command* est
  exactement `npx wrangler deploy`, puis relancer le build.
- **Le téléphone affiche « Réseau indisponible »** : ouvrir l'adresse du Worker
  dans le navigateur du téléphone pour vérifier qu'il est joignable.
- **Le site utilise un autre domaine** (par exemple `clemi.me`) : l'ajouter dans
  `ALLOWED_ORIGIN` de [`wrangler.toml`](../wrangler.toml) (et de
  `clip/relay/wrangler.toml`), séparé par une virgule. Sinon le relais refuse
  la connexion.

## Sécurité en bref

- Chiffrement de bout en bout AES-256-GCM. La clé n'existe que dans le QR code
  (fragment `#` de l'URL, jamais envoyé à un serveur). Ni PeerJS, ni Cloudflare,
  ni GitHub ne peuvent lire le texte.
- Le relais ne fait que transmettre des messages chiffrés : il ne stocke rien et
  n'accepte que les connexions venant du site autorisé (`ALLOWED_ORIGIN`).
- Un seul appareil associé : tout autre appareil présentant le QR code est
  refusé et le PC affiche une alerte.
- Fermer l'onglet du PC ou « Terminer la session » efface le texte sur le
  téléphone.
- Politique de sécurité (CSP) stricte, aucun script externe. PeerJS 1.5.5 et
  qrcode-generator 1.4.4 sont copiés dans `clip/vendor/`.
