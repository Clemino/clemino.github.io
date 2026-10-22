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
