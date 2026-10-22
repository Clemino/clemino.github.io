/*
 * Relais TURN pour le presse-papier sécurisé — Cloudflare Worker.
 *
 * Rôle : fabriquer des accès TURN temporaires à partir de ta clé Cloudflare,
 * sans jamais exposer cette clé au navigateur. Le Worker répond à la page du
 * site par la liste des serveurs ICE (STUN + TURN) à utiliser.
 *
 * Il ne voit jamais le texte : celui-ci est chiffré de bout en bout et transite
 * par le serveur TURN (turn.cloudflare.com), pas par ce Worker.
 *
 * Variables à définir dans les réglages du Worker (voir clip/README.md) :
 *   TURN_KEY_ID         — l'identifiant de ta clé TURN (Cloudflare Realtime)
 *   TURN_KEY_API_TOKEN  — le jeton d'API associé           (secret)
 *   ALLOWED_ORIGIN      — l'adresse exacte de ton site, ex. https://clemino.github.io
 *   TTL                 — (optionnel) durée de validité en secondes, défaut 86400
 */

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || '';
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'GET') {
      return json({ error: 'method' }, 405, cors);
    }
    // N'autorise que ton propre site à demander des accès.
    if (allowed && origin && origin !== allowed) {
      return json({ error: 'origin' }, 403, cors);
    }
    if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) {
      return json({ error: 'config' }, 500, cors);
    }

    const ttl = Number(env.TTL) > 0 ? Number(env.TTL) : 86400;
    const url =
      'https://rtc.live.cloudflare.com/v1/turn/keys/' +
      encodeURIComponent(env.TURN_KEY_ID) +
      '/credentials/generate-ice-servers';

    let upstream;
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.TURN_KEY_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ttl }),
      });
    } catch {
      return json({ error: 'upstream' }, 502, cors);
    }

    if (!upstream.ok) {
      return json({ error: 'upstream', status: upstream.status }, 502, cors);
    }

    const data = await upstream.json().catch(() => null);
    if (!data || !data.iceServers) {
      return json({ error: 'empty' }, 502, cors);
    }

    // On ne renvoie que les serveurs ICE, rien d'autre. Pas de mise en cache
    // (les accès sont temporaires et propres à chaque demande).
    return json({ iceServers: data.iceServers }, 200, { ...cors, 'Cache-Control': 'no-store' });
  },
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
