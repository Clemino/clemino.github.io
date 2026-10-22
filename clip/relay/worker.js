/*
 * Relais WebSocket du presse-papier sécurisé (Cloudflare Worker, offre gratuite).
 *
 * Chaque session (un QR code) a sa « salle », identifiée par un nom dérivé du
 * secret du QR code. Le PC et le ou les téléphones s'y connectent ; le relais
 * fait suivre les messages du téléphone vers le PC et du PC vers un téléphone
 * précis. Il ne peut pas lire leur contenu : tout est chiffré de bout en bout
 * (AES-256-GCM) avant de lui parvenir. Rien n'est enregistré.
 *
 * Trames : « destinataire \n corps » en entrée, « expéditeur \n corps » en
 * sortie. Un expéditeur vide signale un message du relais lui-même.
 *
 * Variable optionnelle (wrangler.toml) : ALLOWED_ORIGIN, liste séparée par des
 * virgules des sites autorisés, ex. « https://clemino.github.io ».
 */

import { DurableObject } from 'cloudflare:workers';

const ROOM_RE = /^clip-[0-9a-f]{32}$/;
const MAX_SOCKETS = 16;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/room\/([^/]+)$/);
    if (!match) {
      return new Response('Relais du presse-papier sécurisé : OK\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    if ((request.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') {
      return new Response('WebSocket attendu', { status: 426 });
    }

    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(request.headers.get('Origin') || '')) {
      return new Response('Origine refusée', { status: 403 });
    }

    const room = match[1];
    const role = url.searchParams.get('role');
    if (!ROOM_RE.test(room) || (role !== 'pc' && role !== 'tel')) {
      return new Response('Requête invalide', { status: 400 });
    }

    const stub = env.ROOMS.get(env.ROOMS.idFromName(room));
    return stub.fetch(request);
  },
};

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    // Battement de cœur des clients, traité sans réveiller la salle.
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch(request) {
    const role = new URL(request.url).searchParams.get('role');
    if (this.sockets().length >= MAX_SOCKETS) {
      return new Response('Salle pleine', { status: 429 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    this.ctx.acceptWebSocket(server, [role]);
    server.serializeAttachment({ id, role });

    const otherPcs = this.sockets('pc', server);
    if (role === 'pc') {
      // Un seul PC par salle : une reconnexion remplace l'ancienne connexion.
      for (const old of otherPcs) old.close(4000, 'remplacé');
      this.notify(this.sockets('tel'), { sys: 'pc', present: true });
    }
    this.notify([server], { sys: 'welcome', id, pc: role === 'pc' || otherPcs.length > 0 });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== 'string') return;
    const nl = message.indexOf('\n');
    if (nl < 0 || nl > 64) return;
    const me = ws.deserializeAttachment();
    const to = message.slice(0, nl);
    const frame = me.id + '\n' + message.slice(nl + 1);

    if (me.role === 'tel') {
      // Un téléphone ne parle qu'au PC.
      for (const pc of this.sockets('pc')) send(pc, frame);
    } else {
      // Le PC parle à un téléphone précis.
      for (const tel of this.sockets('tel')) {
        if (tel.deserializeAttachment().id === to) send(tel, frame);
      }
    }
  }

  async webSocketClose(ws) {
    this.leave(ws);
  }

  async webSocketError(ws) {
    this.leave(ws);
  }

  leave(ws) {
    const me = ws.deserializeAttachment();
    if (!me) return;
    if (me.role === 'pc') {
      if (this.sockets('pc', ws).length === 0) this.notify(this.sockets('tel', ws), { sys: 'pc', present: false });
    } else {
      this.notify(this.sockets('pc', ws), { sys: 'leave', id: me.id });
    }
    try {
      ws.close(1000, 'fin');
    } catch {}
  }

  // Connexions ouvertes de la salle, éventuellement filtrées par rôle.
  sockets(role, except) {
    return this.ctx.getWebSockets(role).filter((w) => w !== except && w.readyState === WebSocket.OPEN);
  }

  notify(list, body) {
    const frame = '\n' + JSON.stringify(body);
    for (const w of list) send(w, frame);
  }
}

function send(ws, frame) {
  try {
    ws.send(frame);
  } catch {}
}
