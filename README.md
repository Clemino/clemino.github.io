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

## /trd/ : apprendre le trading

Parcours du niveau zéro jusqu'au bot : marchés, analyse, gestion du risque, backtest, automatisation, certification AMF.

- Site statique généré par l'application `trdapp`. Le dossier `trd/` est un résultat de build : ne pas le modifier à la main.
- Aucun compte ni serveur : la progression reste dans le navigateur (localStorage), propre à chaque appareil.

## /admin/ : réviser le droit administratif

Parcours de révision du droit administratif (L2, semestre 1) : service public, police administrative, sources de la légalité, limites et contrôle, avec exercices auto-corrigés, cas pratiques guidés et rédactions avec corrigé type.

- Site statique généré par l'application `adminapp`. Le dossier `admin/` est un résultat de build : ne pas le modifier à la main.
- Aucun compte ni serveur : la progression reste dans le navigateur (localStorage), propre à chaque appareil.
- Les corrigés types et les sujets de dissertation sont rédigés pour s'entraîner : ils ne sont pas officiels.
