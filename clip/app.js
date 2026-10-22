'use strict';

/*
 * Presse-papier sécurisé : le PC (émetteur) affiche un QR code contenant un
 * secret aléatoire dans le fragment d'URL (#...), jamais envoyé à un serveur.
 * Le téléphone (récepteur) scanne le QR, puis les deux appareils se parlent en
 * WebRTC (pair à pair, DTLS). Par-dessus, chaque message est chiffré en
 * AES-256-GCM avec une clé dérivée du secret : le serveur de signalisation
 * PeerJS ne voit jamais le texte, même s'il était malveillant.
 *
 * Protocole (v1), par connexion :
 *   PC -> tél   { t: 'hello', n: nPc }                        nonce PC en clair
 *   tél -> PC   { t: 'auth', n: nTel, iv, ct }                 ct = AEAD({ d: idAppareil })
 *   PC -> tél   { t: 'd', iv, ct }                             ct = AEAD({ s, x? , end? })
 *   tél -> PC   { t: 'u', iv, ct }                             ct = AEAD({ s })  (ping)
 * Les données authentifiées (AAD) lient chaque message au sens, à la version
 * et aux deux nonces : aucun rejeu possible d'une connexion à l'autre.
 */

(() => {
  // Refuse de s'exécuter dans un cadre (protection contre le clickjacking).
  if (window.top !== window.self) {
    document.documentElement.textContent = '';
    return;
  }

  const PROTO = 'clip/v1';
  const MAX_CHARS = 200000;
  const MAX_CT = 4 * MAX_CHARS * 2; // borne large sur la taille d'un message chiffré (base64)
  const STORE = 'clip-session';
  const SECRET_RE = /^[A-Za-z0-9_-]{43}$/; // 32 octets en base64url
  const DEVICE_RE = /^[A-Za-z0-9_-]{22}$/; // 16 octets en base64url
  const SIGNALING = { host: '0.peerjs.com', port: 443, path: '/', secure: true, key: 'peerjs', debug: 0 };

  // ---------- Relais ----------
  // Sur un réseau qui bloque les connexions directes (école, entreprise…), les
  // deux appareils ne peuvent pas se joindre en WebRTC. Avec un relais, le texte
  // (déjà chiffré de bout en bout) transite par ton Cloudflare Worker, en
  // WebSocket sur le port 443. Mets ici son adresse (voir clip/README.md).
  // Laissé vide : connexion directe WebRTC uniquement (même wifi, box perso…).
  const RELAY_URL = ''; // ex. 'wss://clip-relay.mon-compte.workers.dev'

  const PING_EVERY = RELAY_URL ? 25000 : 10000;
  const STALE_AFTER = RELAY_URL ? 60000 : 25000;

  // Le relais TURN gratuit fourni par défaut avec PeerJS n'existe plus : on ne
  // garde que des serveurs STUN pour la connexion directe.
  const STUN = [
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
  ];

  const peerOpts = () => ({
    ...SIGNALING,
    config: { iceServers: STUN, sdpSemantics: 'unified-plan', iceCandidatePoolSize: 2 },
  });

  // Imite la petite partie de l'API PeerJS utilisée plus bas (Peer et
  // DataConnection), mais fait passer les messages par le Worker. Topologie en
  // étoile comme en WebRTC : les téléphones ne parlent qu'au PC. Trames :
  // « destinataire \n corps » vers le relais, « expéditeur \n corps » en retour ;
  // un expéditeur vide désigne un message du relais lui-même.

  class Emitter {
    constructor() {
      this._handlers = {};
    }
    on(event, fn) {
      (this._handlers[event] ||= []).push(fn);
      return this;
    }
    emit(event, ...args) {
      for (const fn of this._handlers[event] || []) fn(...args);
    }
  }

  const RELAY_CHUNK = 200000; // caractères par trame : sous la limite de 1 Mio des WebSockets Workers
  const RELAY_HEARTBEAT = 30000;
  const RELAY_DEAD = 150000;

  class RelayConn extends Emitter {
    constructor(peer, remote) {
      super();
      this.peer = peer;
      this.remote = remote; // identifiant du téléphone côté PC ; '' côté téléphone (le PC)
      this._open = false;
      this._closed = false;
    }
    get open() {
      return this._open && !this._closed && this.peer.open;
    }
    send(data) {
      if (this.open) this.peer._send(this.remote, 'd', data);
    }
    close() {
      if (this._closed) return;
      this.peer._send(this.remote, 'close');
      this._finish();
    }
    _finish() {
      if (this._closed) return;
      this._closed = true;
      this._open = false;
      if (this.peer._conns.get(this.remote) === this) this.peer._conns.delete(this.remote);
      this.emit('close');
    }
  }

  class RelayPeer extends Emitter {
    constructor(room, role) {
      super();
      this.room = room;
      this.role = role; // 'pc' ou 'tel'
      this._conns = new Map();
      this._parts = new Map();
      this._open = false;
      this._everOpened = false;
      this._disconnected = false;
      this._destroyed = false;
      this._pcPresent = false;
      this._connect();
    }
    get open() {
      return this._open;
    }
    get disconnected() {
      return this._disconnected;
    }
    get destroyed() {
      return this._destroyed;
    }

    _connect() {
      const url = RELAY_URL.replace(/\/+$/, '') + '/room/' + this.room + '?role=' + this.role;
      let ws;
      try {
        ws = new WebSocket(url);
      } catch {
        setTimeout(() => this._lost(), 0);
        return;
      }
      this.ws = ws;
      this._lastRx = Date.now();
      ws.onmessage = (e) => {
        if (this.ws !== ws) return;
        this._lastRx = Date.now();
        if (typeof e.data === 'string' && e.data !== 'pong') this._onFrame(e.data);
      };
      ws.onclose = () => {
        if (this.ws === ws) this._lost();
      };
      clearInterval(this._beat);
      this._beat = setInterval(() => {
        if (this.ws !== ws) return;
        if (Date.now() - this._lastRx > RELAY_DEAD) ws.close();
        else if (ws.readyState === WebSocket.OPEN) ws.send('ping');
      }, RELAY_HEARTBEAT);
    }

    _lost() {
      const welcomed = this._open;
      this.ws = null;
      this._open = false;
      clearInterval(this._beat);
      for (const c of [...this._conns.values()]) c._finish();
      if (this._destroyed) return;
      if (!this._everOpened) {
        // Comme PeerJS : échec avant toute ouverture = pair détruit.
        this._destroyed = true;
        this.emit('error', { type: 'network' });
        return;
      }
      this._disconnected = true;
      if (!welcomed) this.emit('error', { type: 'network' });
      this.emit('disconnected');
    }

    reconnect() {
      if (this._destroyed || !this._disconnected) return;
      this._disconnected = false;
      this._connect();
    }

    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;
      this._open = false;
      clearInterval(this._beat);
      const ws = this.ws;
      this.ws = null;
      for (const c of [...this._conns.values()]) c._finish();
      if (ws) ws.close();
    }

    // Côté téléphone : ouvre une « connexion » vers le PC de la salle.
    connect() {
      const old = this._conns.get('');
      if (old) old.close();
      const conn = new RelayConn(this, '');
      this._conns.set('', conn);
      if (!this._pcPresent) {
        setTimeout(() => this.emit('error', { type: 'peer-unavailable' }), 0);
        return conn;
      }
      conn._open = true;
      this._send('', 'open');
      return conn;
    }

    _send(to, c, d) {
      const ws = this.ws;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const body = JSON.stringify(d === undefined ? { c } : { c, d });
      if (body.length <= RELAY_CHUNK) {
        ws.send(to + '\n' + body);
        return;
      }
      // Gros message : découpé en morceaux, recollés à l'arrivée.
      const whole = JSON.stringify(d);
      const n = Math.ceil(whole.length / RELAY_CHUNK);
      const k = hex(random(8));
      for (let i = 0; i < n; i++) {
        const p = whole.slice(i * RELAY_CHUNK, (i + 1) * RELAY_CHUNK);
        ws.send(to + '\n' + JSON.stringify({ c: 'part', k, i, n, p }));
      }
    }

    _onFrame(raw) {
      const nl = raw.indexOf('\n');
      if (nl < 0) return;
      const from = raw.slice(0, nl);
      let m;
      try {
        m = JSON.parse(raw.slice(nl + 1));
      } catch {
        return;
      }
      if (!isObj(m)) return;

      if (from === '') {
        // Message du relais.
        if (m.sys === 'welcome') {
          this._open = true;
          this._everOpened = true;
          this._pcPresent = m.pc === true;
          this.emit('open');
        } else if (m.sys === 'leave' && typeof m.id === 'string') {
          const c = this._conns.get(m.id);
          if (c) c._finish();
        } else if (m.sys === 'pc') {
          // Le PC arrive (ou revient) ou s'en va : la connexion en cours ne vaut plus.
          this._pcPresent = m.present === true;
          const c = this._conns.get('');
          if (c) c._finish();
        }
        return;
      }

      const key = this.role === 'pc' ? from : '';
      if (m.c === 'open') {
        if (this.role !== 'pc') return;
        const old = this._conns.get(key);
        if (old) old._finish();
        const conn = new RelayConn(this, key);
        conn._open = true;
        this._conns.set(key, conn);
        this.emit('connection', conn);
        setTimeout(() => {
          if (!conn._closed) conn.emit('open');
        }, 0);
        return;
      }

      const conn = this._conns.get(key);
      if (!conn) return;
      if (m.c === 'close') {
        conn._finish();
      } else if (m.c === 'd') {
        conn.emit('data', m.d);
      } else if (m.c === 'part') {
        this._onPart(from, conn, m);
      }
    }

    _onPart(from, conn, m) {
      if (typeof m.k !== 'string' || typeof m.p !== 'string') return;
      if (!Number.isInteger(m.n) || m.n < 1 || m.n > 64 || !Number.isInteger(m.i) || m.i < 0 || m.i >= m.n) return;
      const id = from + ':' + m.k;
      let entry = this._parts.get(id);
      if (!entry) {
        if (this._parts.size >= 8) this._parts.delete(this._parts.keys().next().value);
        entry = { n: m.n, got: 0, parts: new Array(m.n) };
        this._parts.set(id, entry);
      }
      if (entry.n !== m.n || entry.parts[m.i] !== undefined) return;
      entry.parts[m.i] = m.p;
      if (++entry.got < entry.n) return;
      this._parts.delete(id);
      let d;
      try {
        d = JSON.parse(entry.parts.join(''));
      } catch {
        return;
      }
      conn.emit('data', d);
    }
  }

  // Crée le « pair » : relais WebSocket si configuré, sinon PeerJS (WebRTC).
  // `room` est l'identifiant du PC, dérivé du secret du QR code.
  function createPeer(ownId, room, role) {
    return RELAY_URL ? new RelayPeer(room, role) : new Peer(ownId, peerOpts());
  }

  const $ = (id) => document.getElementById(id);
  const te = new TextEncoder();
  const td = new TextDecoder('utf-8', { fatal: true });

  // ---------- Encodage ----------

  function b64u(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function unb64u(str) {
    if (typeof str !== 'string' || !/^[A-Za-z0-9_-]*$/.test(str)) throw new Error('base64');
    const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  const random = (n) => crypto.getRandomValues(new Uint8Array(n));
  const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const isObj = (m) => m !== null && typeof m === 'object' && !Array.isArray(m);

  function concat(...parts) {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let i = 0;
    for (const p of parts) {
      out.set(p, i);
      i += p.length;
    }
    return out;
  }

  // ---------- Cryptographie ----------

  // Du secret partagé par QR code, on dérive (HKDF-SHA-256) deux valeurs
  // indépendantes : l'identifiant public du PC sur le relais et la clé AES.
  async function deriveSession(secret) {
    const ikm = await crypto.subtle.importKey('raw', secret, 'HKDF', false, ['deriveBits', 'deriveKey']);
    const params = (info) => ({ name: 'HKDF', hash: 'SHA-256', salt: te.encode(PROTO), info: te.encode(info) });
    const idBits = await crypto.subtle.deriveBits(params('peer-id'), ikm, 128);
    const key = await crypto.subtle.deriveKey(
      params('aes-gcm'), ikm, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    return { peerId: 'clip-' + hex(new Uint8Array(idBits)), key };
  }

  const aad = (label, nPc, nTel) => concat(te.encode(PROTO + '/' + label), nPc, nTel);

  async function seal(key, label, nPc, nTel, body) {
    const iv = random(12);
    const ct = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, additionalData: aad(label, nPc, nTel) }, key, te.encode(JSON.stringify(body)));
    return { iv: b64u(iv), ct: b64u(new Uint8Array(ct)) };
  }

  async function unseal(key, label, nPc, nTel, msg) {
    if (typeof msg.ct !== 'string' || msg.ct.length > MAX_CT) throw new Error('size');
    const iv = unb64u(msg.iv);
    if (iv.length !== 12) throw new Error('iv');
    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, additionalData: aad(label, nPc, nTel) }, key, unb64u(msg.ct));
    const body = JSON.parse(td.decode(pt));
    if (!isObj(body)) throw new Error('body');
    return body;
  }

  function readNonce(n) {
    const bytes = unb64u(n);
    if (bytes.length !== 16) throw new Error('nonce');
    return bytes;
  }

  // ---------- Interface commune ----------

  const statusEl = $('status');

  function setStatus(state, text) {
    statusEl.dataset.state = state;
    statusEl.querySelector('.label').textContent = text;
  }

  function fatal(text) {
    for (const el of document.querySelectorAll('main')) el.hidden = true;
    $('fatal-msg').textContent = text;
    $('fatal').hidden = false;
    setStatus('off', 'Inactif');
  }

  function drawQR(canvas, text) {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const quiet = 4;
    const scale = 8;
    const size = (count + quiet * 2) * scale;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
  }

  // ---------- PC : émetteur ----------

  function startSender() {
    const ta = $('text');
    const counter = $('count');
    const pairCard = $('pair');
    const pairMore = $('pair-more');
    const alertBox = $('alert');

    let session = null; // { key, peer }
    let clients = new Set(); // connexions authentifiées
    let trusted = new Set(); // identifiants des appareils associés
    let pairing = true; // un nouvel appareil peut-il rejoindre ?
    let flushTimer = null;
    let generation = 0;

    ta.maxLength = MAX_CHARS;
    $('sender').hidden = false;

    function update() {
      const n = clients.size;
      if (n > 0) setStatus('ok', n === 1 ? '1 appareil connecté' : `${n} appareils connectés`);
      else if (session && session.peer && session.peer.open) setStatus('wait', 'En attente du téléphone');
      else if (session && session.down) setStatus('err', 'Relais injoignable, nouvelle tentative…');
      else setStatus('wait', 'Connexion au relais…');
    }

    function showPairing(on) {
      pairing = on;
      pairCard.hidden = !on;
      pairMore.hidden = on;
    }

    function updateCount() {
      const n = ta.value.length;
      counter.textContent = n >= MAX_CHARS
        ? `Limite de ${MAX_CHARS.toLocaleString('fr-FR')} caractères atteinte`
        : `${n.toLocaleString('fr-FR')} caractère${n > 1 ? 's' : ''}`;
    }

    async function send(c, body) {
      const msg = await seal(c.session.key, 'data', c.nPc, c.nTel, { s: ++c.seq, ...body });
      if (c.conn.open) c.conn.send({ t: 'd', ...msg });
    }

    function flush() {
      clearTimeout(flushTimer);
      flushTimer = null;
      const x = ta.value;
      for (const c of clients) send(c, { x }).catch(() => c.conn.close());
    }

    // Synchrone, pour fonctionner aussi à la fermeture de l'onglet : chaque
    // téléphone reçoit le message de fin préparé à l'authentification et
    // efface le texte.
    function closeSession() {
      const old = session;
      session = null;
      clearTimeout(flushTimer);
      flushTimer = null;
      const olds = [...clients];
      clients = new Set();
      if (!old) return;
      for (const c of olds) {
        if (c.conn.open) c.conn.send(c.endMsg);
        c.conn.close({ flush: true });
      }
      setTimeout(() => old.peer && old.peer.destroy(), 1500);
    }

    async function newSession() {
      const gen = ++generation;
      closeSession();
      alertBox.hidden = true;
      const secret = random(32);
      const { peerId, key } = await deriveSession(secret);
      if (gen !== generation) return;
      session = { peerId, key, peer: null, down: false };
      trusted = new Set();
      drawQR($('qr'), location.origin + location.pathname + '#' + b64u(secret));
      secret.fill(0);
      showPairing(true);
      connectSignaling(session);
      update();
    }

    function connectSignaling(s) {
      const peer = createPeer(s.peerId, s.peerId, 'pc');
      s.peer = peer;
      peer.on('open', () => {
        s.down = false;
        if (s === session) update();
      });
      peer.on('disconnected', () => {
        if (s !== session) return;
        s.down = true;
        update();
        setTimeout(() => {
          if (s === session && s.peer === peer && peer.disconnected && !peer.destroyed) peer.reconnect();
        }, 3000);
      });
      peer.on('error', () => {
        if (s !== session) return;
        s.down = true;
        update();
        // Erreur fatale avant la première connexion : on recrée le pair.
        if (peer.destroyed) {
          setTimeout(() => {
            if (s === session && s.peer === peer) connectSignaling(s);
          }, 5000);
        }
      });
      peer.on('connection', (conn) => onConnection(s, conn));
    }

    function onConnection(s, conn) {
      if (s !== session) {
        conn.close();
        return;
      }
      const c = { conn, session: s, nPc: random(16), nTel: null, seq: 0, upSeq: 0, device: null, authed: false };
      let checking = false;
      const timer = setTimeout(() => {
        if (!c.authed) conn.close();
      }, 15000);

      conn.on('open', () => conn.send({ t: 'hello', n: b64u(c.nPc) }));

      conn.on('data', async (m) => {
        if (!isObj(m)) return;

        // Après l'authentification : seulement des pings chiffrés.
        if (c.authed) {
          if (m.t !== 'u') return;
          try {
            const body = await unseal(s.key, 'up', c.nPc, c.nTel, m);
            if (!Number.isSafeInteger(body.s) || body.s <= c.upSeq) return;
            c.upSeq = body.s;
            await send(c, {});
          } catch {
            conn.close();
          }
          return;
        }

        if (checking) return;
        checking = true;
        try {
          if (m.t !== 'auth') throw new Error('proto');
          const nTel = readNonce(m.n);
          const body = await unseal(s.key, 'auth', c.nPc, nTel, m);
          if (typeof body.d !== 'string' || !DEVICE_RE.test(body.d)) throw new Error('device');
          if (s !== session) throw new Error('session');
          if (!pairing && !trusted.has(body.d)) {
            // Quelqu'un possède le QR code mais n'est pas l'appareil associé.
            alertBox.textContent =
              'Un appareil inconnu disposant du QR code a tenté de se connecter et a été refusé. ' +
              'Si ce n’est pas vous, cliquez sur « Terminer la session ».';
            alertBox.hidden = false;
            conn.send({ t: 'denied' });
            setTimeout(() => conn.close(), 500);
            return;
          }
          c.nTel = nTel;
          c.device = body.d;
          // Numéro maximal : le téléphone l'accepte quel que soit le dernier reçu.
          c.endMsg = { t: 'd', ...(await seal(s.key, 'data', c.nPc, nTel, { s: Number.MAX_SAFE_INTEGER, end: true })) };
          if (s !== session) throw new Error('session');
          c.authed = true;
          clearTimeout(timer);
          trusted.add(body.d);
          // Une reconnexion du même appareil remplace l'ancienne connexion.
          for (const o of clients) {
            if (o.device === body.d) {
              clients.delete(o);
              o.conn.close();
            }
          }
          clients.add(c);
          if (pairing) showPairing(false);
          update();
          await send(c, { x: ta.value });
        } catch {
          conn.close();
        }
      });

      conn.on('close', () => {
        clearTimeout(timer);
        if (clients.delete(c)) update();
      });
      conn.on('error', () => conn.close());
    }

    ta.addEventListener('input', () => {
      updateCount();
      if (!flushTimer) flushTimer = setTimeout(flush, 60);
    });

    $('clear').addEventListener('click', () => {
      ta.value = '';
      updateCount();
      flush();
      ta.focus();
    });

    $('end').addEventListener('click', () => {
      ta.value = '';
      updateCount();
      newSession();
    });

    pairMore.addEventListener('click', () => showPairing(true));

    window.addEventListener('pagehide', closeSession);
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) newSession();
    });

    updateCount();
    newSession();
    ta.focus();
  }

  // ---------- Téléphone : récepteur ----------

  async function startReceiver(stored) {
    const out = $('out');
    const notice = $('notice');
    const copyBtn = $('copy');
    const maskBtn = $('mask');

    $('receiver').hidden = false;
    setStatus('wait', 'Connexion…');

    const { peerId, key } = await deriveSession(unb64u(stored.s));
    const device = stored.d;

    let peer = null;
    let conn = null; // { dc, nPc, nTel, ... } de la connexion courante
    let retryTimer = null;
    let ended = false;
    let failStreak = 0; // tentatives directes échouées d'affilée (jamais connectées)

    function show(text) {
      out.textContent = text;
      copyBtn.disabled = text.length === 0;
    }

    function retry(ms) {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(reconnect, ms);
    }

    function reconnect() {
      clearTimeout(retryTimer);
      if (ended) return;
      if (peer && peer.open) dial();
      else if (peer && !peer.destroyed && !peer.disconnected) retry(3000); // connexion au relais en cours
      else makePeer();
    }

    function makePeer() {
      clearTimeout(retryTimer);
      const oldConn = conn;
      const oldPeer = peer;
      conn = null;
      peer = null;
      if (oldConn) oldConn.dc.close();
      if (oldPeer) oldPeer.destroy();
      const p = createPeer('clipr-' + hex(random(16)), peerId, 'tel');
      peer = p;
      p.on('open', () => {
        if (p === peer && !ended) dial();
      });
      // Sans relais, une liaison directe établie continue de fonctionner :
      // on ne recrée le pair que lorsqu'elle tombe.
      p.on('disconnected', () => {
        if (p !== peer || ended) return;
        if (!conn || !conn.live) retry(3000);
      });
      p.on('error', (err) => {
        if (p !== peer || ended) return;
        if (err.type === 'peer-unavailable') {
          setStatus('err', 'PC injoignable — page fermée ?');
          retry(4000);
          return;
        }
        if (!conn || !conn.live) {
          setStatus('err', 'Réseau indisponible, nouvelle tentative…');
          retry(4000);
        }
      });
    }

    function drop(c) {
      if (conn !== c) return;
      conn = null;
      if (c.live) {
        setStatus('err', 'Connexion perdue, reconnexion…');
      } else if (!c.denied) {
        // La connexion directe n'a jamais abouti : souvent un réseau qui la bloque.
        failStreak++;
        if (failStreak >= 2) {
          setStatus('err', RELAY_URL ? 'Connexion difficile, nouvelle tentative…' : 'Connexion bloquée par le réseau');
          if (!RELAY_URL && failStreak === 2) {
            notice.textContent =
              'La connexion directe est bloquée sur ce réseau (wifi d’école ou d’entreprise, par exemple). ' +
              'Pour l’utiliser ici, il faut configurer un relais : voir le fichier clip/README.md du site. ' +
              'Les nouvelles tentatives continuent en arrière-plan.';
            notice.hidden = false;
          }
        }
      }
      c.live = false;
      retry(c.denied ? 5000 : 1500);
    }

    function dial() {
      clearTimeout(retryTimer);
      const old = conn;
      conn = null;
      if (old) old.dc.close();

      const dc = peer.connect(peerId, { reliable: true });
      const c = { dc, nPc: null, nTel: null, seq: 0, upSeq: 0, live: false, denied: false, lastRx: 0 };
      conn = c;
      const timer = setTimeout(() => {
        if (conn === c && !c.live) dc.close();
      }, 15000);

      dc.on('data', async (m) => {
        if (conn !== c || !isObj(m)) return;

        if (m.t === 'hello' && !c.nPc) {
          try {
            c.nPc = readNonce(m.n);
            c.nTel = random(16);
            const auth = await seal(key, 'auth', c.nPc, c.nTel, { d: device });
            dc.send({ t: 'auth', n: b64u(c.nTel), ...auth });
          } catch {
            dc.close();
          }
          return;
        }

        if (m.t === 'denied' && !c.live) {
          c.denied = true;
          setStatus('err', 'Refusé : sur le PC, cliquez sur « Associer un autre appareil »');
          return;
        }

        if (m.t === 'd' && c.nTel) {
          let body;
          try {
            body = await unseal(key, 'data', c.nPc, c.nTel, m);
          } catch {
            dc.close();
            return;
          }
          if (conn !== c || !Number.isSafeInteger(body.s) || body.s <= c.seq) return;
          c.seq = body.s;
          c.lastRx = Date.now();
          if (!c.live) {
            c.live = true;
            failStreak = 0;
            clearTimeout(timer);
            notice.hidden = true;
            setStatus('ok', 'Connecté · chiffré de bout en bout');
          }
          if (body.end === true) finish('La session a été terminée depuis le PC. Le texte a été effacé.');
          else if (typeof body.x === 'string') show(body.x);
        }
      });

      dc.on('close', () => {
        clearTimeout(timer);
        drop(c);
      });
      dc.on('error', () => dc.close());
    }

    async function ping() {
      const c = conn;
      if (!c || !c.live) return;
      if (Date.now() - c.lastRx > STALE_AFTER) {
        c.dc.close();
        return;
      }
      try {
        const msg = await seal(key, 'up', c.nPc, c.nTel, { s: ++c.upSeq });
        if (c.dc.open) c.dc.send({ t: 'u', ...msg });
      } catch {
        c.dc.close();
      }
    }

    function finish(text) {
      ended = true;
      clearTimeout(retryTimer);
      clearInterval(pingTimer);
      try {
        sessionStorage.removeItem(STORE);
      } catch {}
      const c = conn;
      conn = null;
      if (c) c.dc.close();
      if (peer) peer.destroy();
      show('');
      out.hidden = true;
      $('bar').hidden = true;
      notice.textContent = text;
      notice.hidden = false;
      setStatus('off', 'Session terminée');
    }

    const pingTimer = setInterval(ping, PING_EVERY);

    // Au retour sur l'onglet, vérifie tout de suite que la liaison est vivante.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || ended) return;
      if (conn && conn.live) {
        const sent = Date.now();
        ping();
        setTimeout(() => {
          if (conn && conn.live && conn.lastRx < sent) conn.dc.close();
        }, 5000);
      } else {
        reconnect();
      }
    });
    window.addEventListener('online', () => {
      if (!ended && !(conn && conn.live)) reconnect();
    });

    copyBtn.addEventListener('click', async () => {
      const label = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(out.textContent);
        copyBtn.textContent = 'Copié ✓';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(out);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = 'Sélectionné';
      }
      setTimeout(() => {
        copyBtn.textContent = label;
      }, 1500);
    });

    maskBtn.addEventListener('click', () => {
      const masked = out.classList.toggle('masked');
      maskBtn.textContent = masked ? 'Afficher' : 'Masquer';
      maskBtn.setAttribute('aria-pressed', String(masked));
    });

    $('quit').addEventListener('click', () => finish('Session fermée sur ce téléphone.'));

    show('');
    makePeer();
  }

  // ---------- Démarrage ----------

  function readStored() {
    try {
      const v = JSON.parse(sessionStorage.getItem(STORE));
      if (isObj(v) && SECRET_RE.test(v.s) && DEVICE_RE.test(v.d)) return v;
    } catch {}
    return null;
  }

  async function main() {
    // Avec le relais, WebRTC (parfois désactivé sur les postes gérés) est inutile.
    if (!window.isSecureContext || !window.crypto || !crypto.subtle || (!RELAY_URL && !window.RTCPeerConnection)) {
      fatal('Ce navigateur ne prend pas en charge le chiffrement ou WebRTC nécessaires. Utilisez un navigateur récent en HTTPS.');
      return;
    }
    if ((!RELAY_URL && typeof window.Peer !== 'function') || typeof window.qrcode !== 'function') {
      fatal('Impossible de charger les composants de la page. Rechargez-la.');
      return;
    }

    let stored = readStored();
    const hash = location.hash.slice(1);
    if (hash) {
      // Retire le secret de la barre d'adresse et de l'historique de l'onglet.
      history.replaceState(null, '', location.pathname);
      if (!SECRET_RE.test(hash)) {
        fatal('Lien invalide ou incomplet. Rescannez le QR code affiché sur le PC.');
        return;
      }
      if (!stored || stored.s !== hash) stored = { s: hash, d: b64u(random(16)) };
      try {
        sessionStorage.setItem(STORE, JSON.stringify(stored));
      } catch {}
    }

    if (stored) startReceiver(stored).catch(() => fatal('Lien invalide. Rescannez le QR code affiché sur le PC.'));
    else startSender();
  }

  main().catch(() => fatal('Une erreur est survenue au démarrage. Rechargez la page.'));
})();
