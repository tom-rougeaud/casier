/*
  Projet : Casier — intros animées des thèmes  ·  Version : 1.0.0  ·  Date : 21/11/2026
  Auteur : Tom Rougeaud  ·  Licence : CC BY-NC 4.0
  Réalisé avec l’aide de l’IA : Claude Sonnet 5.5 (Anthropic)
  Rôle : à chaque ouverture d’un thème, une petite intro animée (logo dessiné ici, jingle fabriqué par Web Audio).
  Tout est original : aucun logo, aucune image et aucun son d’une marque réelle ; rien n’est téléchargé.
  Usage : <script src="../intros.js"></script> puis INTROS.lancer("98", function () { suite(); });
  Données : une seule préférence facultative, « ne plus afficher l’intro » (clé casier_intros_v1, sur cet appareil seulement).
*/
(function () {
  "use strict";

  /* ===== SECTION : Réglages et stockage protégé ===== */
  var CLE = "casier_intros_v1";
  var reduit = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  function lire() { try { return window.localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v) { try { window.localStorage.setItem(CLE, v); } catch (e) { /* ignoré : la préférence ne sera pas gardée */ } }

  /* Habillage de la « porte » (écran « appuie pour allumer ») : fond, texte, accent, nom de l’appareil. */
  var PORTES = {
    "98": ["#2a6a8a", "#fff", "#c0c0c0", "l’ordinateur"], xp: ["#000", "#e8e8e8", "#3a7bd5", "l’ordinateur"],
    macintosh: ["#e9e9ee", "#333", "#8e8e99", "l’ordinateur"], classique: ["#d8d8d8", "#222", "#888", "l’ordinateur"],
    w31: ["#000", "#c0c0c0", "#808080", "l’ordinateur"], amiga: ["#0055aa", "#fff", "#ff8800", "l’ordinateur"],
    beos: ["#336699", "#fff", "#ffcb00", "l’ordinateur"], minitel: ["#000", "#d8e4d4", "#8ea58a", "le Minitel"],
    c64: ["#4a45b0", "#b9b5f5", "#8f8be0", "l’ordinateur"], apple2: ["#000", "#f0a800", "#a87400", "le moniteur"],
    horizon: ["#0b0d12", "#e8eaf2", "#6b78e0", "l’écran"], atomique: ["#efe3c8", "#3b2a20", "#c8553d", "le poste"]
  };

  /* ===== SECTION : Son (Web Audio, tout est synthétisé) ===== */
  var ctx = null, maitre = null, T0 = 0, buf = null;
  function audio() {
    if (ctx) return ctx;
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); maitre = ctx.createGain(); maitre.gain.value = 0.55; maitre.connect(ctx.destination); } catch (e) { ctx = null; }
    return ctx;
  }
  /* Note : fréquence f, début t (s), durée d, forme, volume v, glissando facultatif g (fréquence finale). */
  function ton(f, t, d, type, v, g, attaque) {
    if (!ctx) return;
    try {
      var o = ctx.createOscillator(), a = ctx.createGain(), s = T0 + t, at = attaque || 0.02;
      o.type = type || "sine"; o.frequency.setValueAtTime(f, s);
      if (g) o.frequency.exponentialRampToValueAtTime(g, s + d);
      a.gain.setValueAtTime(0.0001, s); a.gain.exponentialRampToValueAtTime(v || 0.2, s + at); a.gain.exponentialRampToValueAtTime(0.0001, s + d);
      o.connect(a); a.connect(maitre); o.start(s); o.stop(s + d + 0.05);
    } catch (e) { /* ignoré */ }
  }
  /* Accord : plusieurs notes en même temps. */
  function accord(fs, t, d, type, v, attaque) { for (var i = 0; i < fs.length; i++) ton(fs[i], t, d, type, v, 0, attaque); }
  /* Bruit filtré (souffle, moteur de disquette, modem). */
  function bruit(t, d, freq, v, q, type) {
    if (!ctx) return;
    try {
      if (!buf) { buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); var x = buf.getChannelData(0); for (var i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), a = ctx.createGain(), p = T0 + t;
      s.buffer = buf; s.loop = true; f.type = type || "bandpass"; f.frequency.value = freq; f.Q.value = q || 1;
      a.gain.setValueAtTime(0.0001, p); a.gain.exponentialRampToValueAtTime(v || 0.1, p + 0.02); a.gain.exponentialRampToValueAtTime(0.0001, p + d);
      s.connect(f); f.connect(a); a.connect(maitre); s.start(p); s.stop(p + d + 0.05);
    } catch (e) { /* ignoré */ }
  }
  /* Balayage de fréquence (synthé analogique : la fréquence monte en filtrant une dent de scie). */
  function balayage(f1, f2, t, d, v) {
    if (!ctx) return;
    try {
      var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), a = ctx.createGain(), s = T0 + t;
      o.type = "sawtooth"; o.frequency.setValueAtTime(f1, s); o.frequency.exponentialRampToValueAtTime(f2, s + d);
      f.type = "lowpass"; f.frequency.setValueAtTime(300, s); f.frequency.exponentialRampToValueAtTime(5000, s + d); f.Q.value = 4;
      a.gain.setValueAtTime(0.0001, s); a.gain.exponentialRampToValueAtTime(v || 0.12, s + d * 0.7); a.gain.exponentialRampToValueAtTime(0.0001, s + d + 0.3);
      o.connect(f); f.connect(a); a.connect(maitre); o.start(s); o.stop(s + d + 0.4);
    } catch (e) { /* ignoré */ }
  }
  /* Double tonalité (touches de téléphone, modem). */
  function dtmf(f1, f2, t, d, v) { ton(f1, t, d, "sine", v || 0.12, 0, 0.005); ton(f2, t, d, "sine", v || 0.12, 0, 0.005); }

  /* ===== SECTION : Dessins originaux (logos animés) ===== */
  /* Quatre casiers colorés : le logo maison des intros 98 / XP / 3.1. */
  function casiers(c, taille, classe) {
    var h = "";
    for (var i = 0; i < 4; i++) {
      var x = (i % 2) * 34, y = Math.floor(i / 2) * 34;
      h += '<g class="cas c' + i + '" transform="translate(' + x + ' ' + y + ')"><rect width="31" height="31" rx="3" fill="' + c[i] + '"/>' +
        '<rect x="3" y="3" width="25" height="25" rx="2" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>' +
        '<rect x="12" y="13" width="7" height="4" rx="1.5" fill="rgba(0,0,0,.35)"/></g>';
    }
    return '<svg class="' + (classe || "logo4") + '" viewBox="0 0 65 65" width="' + taille + '" height="' + taille + '" aria-hidden="true">' + h + '</svg>';
  }
  /* Poire multicolore (thème Macintosh « 2000 »). */
  function poire(taille) {
    var cs = ["#69a84f", "#e5c23d", "#e08c32", "#cc4c4c", "#8a5ca8", "#4b86c6"], r = "";
    for (var i = 0; i < 6; i++) r += '<rect x="0" y="' + (14 + i * 14) + '" width="100" height="14" fill="' + cs[i] + '"/>';
    return '<svg class="poire" viewBox="0 0 100 100" width="' + taille + '" height="' + taille + '" aria-hidden="true"><defs><clipPath id="ip"><path d="M50 22C44 22 41 27 41 32C28 40 20 54 20 68C20 86 34 96 50 96C66 96 80 86 80 68C80 54 72 40 59 32C59 27 56 22 50 22Z"/></clipPath></defs>' +
      '<g clip-path="url(#ip)">' + r + '</g><path d="M52 20C55 8 66 4 74 8C70 17 61 22 52 20Z" fill="#6aa84f"/><path d="M50 22C50 16 51 12 53 9" stroke="#5a4a32" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
  }
  /* Disquette (Workbench). */
  function disquette() {
    return '<svg class="disq" viewBox="0 0 80 84" width="150" height="158" aria-hidden="true"><rect x="2" y="2" width="76" height="80" rx="5" fill="#3b4a8a" stroke="#fff" stroke-width="2"/>' +
      '<rect x="20" y="3" width="40" height="26" fill="#c9ccd4"/><rect x="48" y="7" width="8" height="18" fill="#3b4a8a"/>' +
      '<rect x="10" y="40" width="60" height="38" rx="2" fill="#f2efe4"/><text x="40" y="58" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12" fill="#222">CASIER</text><path d="M16 66h48M16 72h48" stroke="#b9b5a8"/></svg>';
  }
  /* Atome rétro-futuriste (orbites qui tournent). */
  function atome() {
    return '<svg class="atome" viewBox="-60 -60 120 120" width="190" height="190" aria-hidden="true"><g fill="none" stroke-width="3">' +
      '<ellipse class="o1" rx="52" ry="18" stroke="#c8553d"/><ellipse class="o2" rx="52" ry="18" stroke="#2f6f73" transform="rotate(60)"/><ellipse class="o3" rx="52" ry="18" stroke="#d9a441" transform="rotate(120)"/></g>' +
      '<circle r="9" fill="#3b2a20"/><circle r="3.5" fill="#efe3c8"/></svg>';
  }
  var ICO_MARCHE = '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><path d="M24 6v18" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M14 12a15 15 0 1 0 20 0" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';

  /* ===== SECTION : Feuille de style des intros (injectée une seule fois) ===== */
  var CSS = [
    "#intro,#intro-porte{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;transition:opacity .45s;font-family:system-ui,Segoe UI,Arial,sans-serif}",
    "#intro.fin,#intro-porte.fin{opacity:0;pointer-events:none}",
    "#intro-porte{gap:18px;text-align:center;padding:20px}",
    "#intro-marche{width:92px;height:92px;border-radius:50%;border:3px solid currentColor;background:transparent;color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:ipulse 2.4s ease-in-out infinite}",
    "#intro-marche:focus-visible,.intro-lien:focus-visible{outline:3px solid currentColor;outline-offset:4px}",
    ".intro-lien{background:none;border:0;color:inherit;opacity:.75;text-decoration:underline;font:inherit;cursor:pointer;padding:6px}",
    "#intro-porte label{font-size:14px;opacity:.8;cursor:pointer}",
    "@keyframes ipulse{50%{box-shadow:0 0 0 14px rgba(255,255,255,.08)}}",
    "#intro .passer{position:absolute;right:14px;bottom:12px;font-size:13px;opacity:.65;z-index:5}",
    "#intro .mono{font-family:'Courier New','DejaVu Sans Mono','Liberation Mono',monospace}",
    "@keyframes ifondu{from{opacity:0}to{opacity:1}}",
    "@keyframes imonte{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}",
    "@keyframes iclig{50%{opacity:0}}",
    "@keyframes ibarre{from{width:0}to{width:100%}}",
    "@keyframes iglisse{from{transform:translateX(-120%)}to{transform:translateX(420%)}}",
    "@keyframes inuage{from{transform:translateX(-30vw)}to{transform:translateX(130vw)}}",
    "@keyframes irot{to{transform:rotate(360deg)}}",
    "@keyframes iouvre{to{transform:perspective(200px) rotateY(-70deg);opacity:.35}}",
    "@keyframes ichute{0%{transform:translateY(-120%)}70%{transform:translateY(8%)}100%{transform:translateY(0)}}",
    "@keyframes iallume{from{opacity:.15;filter:grayscale(1)}to{opacity:1;filter:none}}",
    "@keyframes ichauffe{0%{transform:scaleY(.005) scaleX(.2);opacity:1}40%{transform:scaleY(.005) scaleX(1)}100%{transform:none}}",
    "@keyframes irayon{from{transform:scale(.2) rotate(0);opacity:0}to{transform:scale(1) rotate(8deg);opacity:1}}",
    "@keyframes irevele{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}",
    "@keyframes irevhaut{from{transform:translateY(105%)}to{transform:none}}",
    "@keyframes ibord{0%{background:#7c70da}20%{background:#b25a5a}40%{background:#5aa65a}60%{background:#d8cc6a}80%{background:#6a6ad8}100%{background:#7c70da}}",
    "@media (prefers-reduced-motion:reduce){#intro *,#intro-porte *{animation-duration:.01s!important;animation-delay:0s!important}}",

    /* 98 : ciel, nuages, quatre casiers, barre segmentée */
    ".i-98{background:linear-gradient(#2a5fa0,#8fbbe6)}",
    ".i-98 .nuage{position:absolute;width:260px;height:70px;border-radius:50%;background:rgba(255,255,255,.55);filter:blur(14px);animation:inuage 12s linear infinite}",
    ".i-98 h1{font:italic bold 46px/1 'Times New Roman',serif;color:#fff;text-shadow:2px 2px 0 #1a3a6a;margin:14px 0 4px;animation:imonte .8s .5s both}",
    ".i-98 h1 small{font-size:22px;font-weight:normal}",
    ".i-98 .logo4{animation:ichute .9s ease-out both}.i-98 .cas{animation:iallume .5s both}.i-98 .c1{animation-delay:.2s}.i-98 .c2{animation-delay:.4s}.i-98 .c3{animation-delay:.6s}",
    ".i-98 .seg{width:300px;height:16px;border:2px solid #fff;background:#10305a;overflow:hidden;position:relative;margin-top:26px}",
    ".i-98 .seg i{position:absolute;top:2px;bottom:2px;width:60px;background:repeating-linear-gradient(90deg,#4aa0ff 0 10px,transparent 10px 14px);animation:iglisse 1.4s linear infinite}",

    /* XP : fond noir, logo, barre à trois blocs */
    ".i-xp{background:#000;color:#fff}",
    ".i-xp .logo4{animation:ifondu 1s both}.i-xp .cas{transform-origin:center;transform-box:fill-box}",
    ".i-xp h1{font:600 40px/1 'Trebuchet MS',Verdana,sans-serif;margin:16px 0 0;letter-spacing:-1px;animation:ifondu 1s .4s both}",
    ".i-xp h1 b{color:#f08a2c;font-style:italic;font-size:26px;vertical-align:top}",
    ".i-xp .rail{width:210px;height:18px;border:2px solid #8a8a8a;border-radius:6px;margin-top:46px;overflow:hidden;position:relative}",
    ".i-xp .rail i{position:absolute;top:2px;bottom:2px;left:0;width:56px;background:repeating-linear-gradient(90deg,#3a7bd5 0 14px,transparent 14px 18px);border-radius:2px;animation:iglisse 1.6s linear infinite}",
    ".i-xp .bas{position:absolute;bottom:26px;font-size:14px;color:#cfcfcf;animation:ifondu 1s 1s both}",

    /* Macintosh « 2000 » : fond clair, poire, anneau */
    ".i-macintosh{background:radial-gradient(circle at 50% 40%,#fff,#dcdce6);color:#333}",
    ".i-macintosh .poire{animation:ifondu 1.2s both,imonte 1.2s both;filter:drop-shadow(0 6px 10px rgba(0,0,0,.22))}",
    ".i-macintosh .anneau{width:34px;height:34px;border-radius:50%;border:4px solid #bbb;border-top-color:#555;margin-top:36px;animation:irot 1s linear infinite}",
    ".i-macintosh p{margin:18px 0 0;font-size:15px;opacity:.7}",
    ".i-classique{background:#e6e6e6;color:#222}",
    ".i-classique .mac{width:96px;height:104px;border:3px solid #222;border-radius:10px 10px 6px 6px;background:#d6d3c6;position:relative;animation:imonte .7s both}",
    ".i-classique .mac::before{content:'';position:absolute;left:10px;right:10px;top:10px;height:56px;border:3px solid #222;border-radius:8px;background:#e8f2e6}",
    ".i-classique .mac::after{content:'‿';position:absolute;left:0;right:0;top:28px;text-align:center;font:bold 34px/1 monospace;color:#222}",
    ".i-classique .fente{position:absolute;left:30px;right:30px;bottom:12px;height:5px;background:#222;border-radius:3px}",
    ".i-classique p{margin:22px 0 0;font:15px monospace;animation:ifondu .6s .6s both}",

    /* Windows 3.1 : bandes de couleur et bannière */
    ".i-w31{background:#000;color:#fff}",
    ".i-w31 .bandes{display:flex;gap:0;height:110px;align-items:flex-end}",
    ".i-w31 .bandes i{width:26px;transform-origin:bottom;animation:irayon .6s both;height:100%}",
    ".i-w31 h1{font:bold 54px/1 Arial,Helvetica,sans-serif;letter-spacing:2px;margin:18px 0 4px;animation:imonte .8s .7s both}",
    ".i-w31 p{margin:0;font:18px Arial,sans-serif;color:#c0c0c0;animation:ifondu .8s 1.2s both}",

    /* Workbench : disquette qui entre dans le lecteur */
    ".i-amiga{background:#fff;color:#0055aa}",
    ".i-amiga .fente{width:210px;height:14px;background:#0055aa;border:3px solid #000;margin-top:-6px;position:relative;z-index:2}",
    ".i-amiga .disq{animation:ichute 2.2s ease-in both}",
    ".i-amiga p{font:bold 20px 'Courier New',monospace;margin:26px 0 0;animation:ifondu .6s .4s both}",
    ".i-amiga.bleu{background:#0055aa;color:#fff;transition:background .3s}",

    /* BeOS : icônes qui s'allument, onglet jaune */
    ".i-beos{background:#d8d8d8;color:#222}",
    ".i-beos .onglet{background:#ffcb00;border-radius:9px 9px 0 0;padding:6px 18px;font:bold 16px Verdana,sans-serif;box-shadow:0 0 0 1px #666;animation:imonte .6s both}",
    ".i-beos .carte{width:330px;background:#e8e8e8;box-shadow:0 0 0 1px #666,4px 5px 12px rgba(0,0,0,.35);padding:26px 20px 22px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap}",
    ".i-beos .carte span{width:40px;height:40px;border-radius:9px;display:block;animation:iallume .5s both}",
    ".i-beos .fil{width:330px;height:6px;background:#bbb;margin-top:14px;border-radius:3px;overflow:hidden}.i-beos .fil i{display:block;height:100%;background:#ffcb00;animation:ibarre 4s linear both}",

    /* Terminaux à phosphore (Minitel, C64, Apple II) */
    ".i-minitel,.i-apple2{background:#000}",
    ".i-term{width:min(92vw,720px);padding:22px;white-space:pre;font-size:min(3.4vw,20px);line-height:1.35;animation:ichauffe .9s ease-out both}",
    ".i-minitel .i-term{color:#d8e4d4;text-shadow:0 0 6px rgba(216,228,212,.55)}",
    ".i-apple2 .i-term{color:#f0a800;text-shadow:0 0 7px rgba(240,168,0,.6)}",
    ".i-term .gros{font-size:2.2em;letter-spacing:.08em;line-height:1.1;display:block}",
    ".i-term .cur{display:inline-block;width:.6em;height:1em;background:currentColor;vertical-align:-.12em;animation:iclig 1s steps(1) infinite}",
    ".i-term .inv{background:currentColor;color:#000;text-shadow:none;padding:0 .4em}",
    ".i-minitel::after,.i-apple2::after,.i-c64::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px),radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55))}",
    ".i-c64{background:#7c70da;animation:ibord .35s steps(1) 6}",
    ".i-c64.fixe{animation:none;background:#7c70da}",
    ".i-c64 .ecr{background:#4a45b0;color:#b9b5f5;width:min(88vw,760px);height:min(74vh,520px);padding:20px;white-space:pre;font-size:min(3.6vw,22px);line-height:1.3;overflow:hidden}",
    ".i-c64 .cur{display:inline-block;width:.6em;height:1em;background:#b9b5f5;vertical-align:-.12em;animation:iclig 1s steps(1) infinite}",

    /* Horizon (moderne) : halo et titre masqué */
    ".i-horizon{background:#07080c;color:#f2f3f8}",
    ".i-horizon .halo{position:absolute;width:60vmin;height:60vmin;border-radius:50%;background:radial-gradient(circle,rgba(107,120,224,.55),rgba(63,167,160,.18) 55%,transparent 70%);filter:blur(30px);animation:ifondu 2s both,irot 14s linear infinite}",
    ".i-horizon .masque{overflow:hidden;position:relative;z-index:2}",
    ".i-horizon h1{font:700 min(16vw,150px)/1 system-ui,'Segoe UI',sans-serif;letter-spacing:-.04em;margin:0;animation:irevhaut 1s .4s cubic-bezier(.2,.8,.2,1) both}",
    ".i-horizon p{position:relative;z-index:2;margin:10px 0 0;font:300 min(4.4vw,22px) system-ui,sans-serif;letter-spacing:.3em;text-transform:uppercase;opacity:.75;animation:ifondu 1s 1.4s both}",
    ".i-horizon .trait{position:relative;z-index:2;height:2px;width:min(60vw,420px);background:linear-gradient(90deg,transparent,#e8eaf2,transparent);margin-top:26px;animation:irevele 1.4s 1s both}",

    /* Atomique (rétro-futuriste) : rayons, atome, grain */
    ".i-atomique{background:#efe3c8;color:#3b2a20}",
    ".i-atomique .rayons{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(200,85,61,.16) 0 7.5deg,transparent 7.5deg 15deg);animation:irot 40s linear infinite}",
    ".i-atomique .atome{position:relative;z-index:2;animation:ifondu 1s both}.i-atomique .atome .o1{animation:irot 6s linear infinite;transform-origin:center}",
    ".i-atomique h1{position:relative;z-index:2;font:900 min(13vw,92px)/1 'Futura','Century Gothic','Trebuchet MS',sans-serif;letter-spacing:.12em;margin:10px 0 0;color:#c8553d;text-shadow:3px 3px 0 #efe3c8,6px 6px 0 #2f6f73;animation:imonte .9s .5s both}",
    ".i-atomique p{position:relative;z-index:2;margin:18px 0 0;font:14px 'Courier New',monospace;letter-spacing:.25em;text-transform:uppercase;animation:ifondu 1s 1.3s both}",
    ".i-atomique .grain{position:absolute;inset:0;opacity:.28;mix-blend-mode:multiply;pointer-events:none;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  0 0 0 .9 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")}"
  ].join("\n");
  function injecterStyle() {
    if (document.getElementById("intros-style")) return;
    var s = document.createElement("style"); s.id = "intros-style"; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ===== SECTION : Scénarios (un par thème) : chacun construit son décor, joue son jingle, renvoie sa durée en secondes ===== */
  var timers = [];
  function apres(ms, f) { timers.push(setTimeout(f, ms)); }
  /* Écrit du texte caractère par caractère dans un élément (machine à écrire). */
  function taper(el, texte, debutMs, parSigne, fin) {
    var i = 0;
    apres(debutMs, function boucle() {
      if (!el.isConnected) return;
      i++; el.insertAdjacentText("beforeend", texte.charAt(i - 1));
      if (i < texte.length) timers.push(setTimeout(boucle, parSigne)); else if (fin) fin();
    });
  }
  var SCENES = {};

  SCENES["98"] = function (r) {
    r.innerHTML = '<i class="nuage" style="top:12%;animation-delay:-2s"></i><i class="nuage" style="top:55%;animation-delay:-7s;width:340px"></i><i class="nuage" style="top:78%"></i>' +
      casiers(["#d8503f", "#4caf50", "#3b79d8", "#e8c23a"], 120) + '<h1>Casier <small>Édition</small> 98</h1><div class="seg"><i></i></div>';
    var n = [293.66, 440, 587.33, 739.99, 880, 1174.66];
    n.forEach(function (f, i) { ton(f, 0.25 + i * 0.28, 1.6, "triangle", 0.14); ton(f * 2, 0.25 + i * 0.28, 1.0, "sine", 0.04); });
    accord([146.83, 220, 293.66, 369.99], 0.2, 3.6, "sine", 0.05, 0.8); accord([293.66, 369.99, 440, 587.33], 2.0, 2.4, "triangle", 0.07);
    return 4.6;
  };
  SCENES.xp = function (r) {
    r.innerHTML = casiers(["#f08a2c", "#6fb04a", "#3a7bd5", "#f2c23a"], 110) + '<h1>Casier<b>xp</b></h1><div class="rail"><i></i></div><div class="bas">Chargement de ton casier…</div>';
    accord([155.56, 233.08, 311.13], 0.2, 3.2, "sine", 0.07, 1.0); accord([466.16, 622.25, 783.99], 0.6, 3.0, "sine", 0.04, 1.2);
    [622.25, 783.99, 932.33].forEach(function (f, i) { ton(f, 1.4 + i * 0.35, 1.6, "triangle", 0.12); });
    return 4.4;
  };
  SCENES.macintosh = function (r) {
    r.innerHTML = poire(120) + '<div class="anneau"></div><p>Démarrage…</p>';
    accord([130.81, 196, 261.63, 329.63, 392, 523.25], 0.15, 3.8, "triangle", 0.09, 0.03);
    ton(1046.5, 0.15, 2.5, "sine", 0.05); ton(65.41, 0.15, 3.2, "sine", 0.2, 0, 0.05);
    return 3.8;
  };
  SCENES.classique = function (r) {
    r.innerHTML = '<div class="mac"><i class="fente"></i></div><p>Bienvenue au Casier</p>';
    ton(523.25, 0.3, 1.4, "sine", 0.2); ton(392, 0.75, 1.9, "sine", 0.2); ton(130.81, 0.3, 2.4, "triangle", 0.1);
    return 3.2;
  };
  SCENES.w31 = function (r) {
    var cs = ["#aa0000", "#aa5500", "#ffff55", "#00aa00", "#00aaaa", "#0000aa", "#aa00aa"], b = "";
    cs.forEach(function (c, i) { b += '<i style="background:' + c + ';animation-delay:' + (i * 0.1) + 's;height:' + (50 + i * 10) + 'px"></i>'; });
    r.innerHTML = '<div class="bandes">' + b + '</div><h1>Casier 3.1</h1><p>Programme de gestion des ressources</p>';
    [261.63, 329.63, 392, 523.25].forEach(function (f, i) { ton(f, 0.15 + i * 0.16, 0.5, "square", 0.07); });
    accord([523.25, 659.25, 783.99, 1046.5], 0.95, 1.8, "square", 0.05);
    return 3.6;
  };
  SCENES.amiga = function (r) {
    r.innerHTML = disquette() + '<div class="fente"></div><p>Insère la disquette CASIER…</p>';
    for (var i = 0; i < 9; i++) bruit(1.0 + i * 0.2, 0.12, 180 + (i % 3) * 60, 0.12, 4, "bandpass");
    ton(70, 0.3, 1.8, "sawtooth", 0.025);
    for (var k = 0; k < 4; k++) ton(1500, 2.5 + k * 0.06, 0.03, "square", 0.04);
    ton(440, 3.2, 0.2, "square", 0.06); ton(660, 3.45, 0.35, "square", 0.06);
    apres(2300, function () { r.classList.add("bleu"); r.innerHTML = '<p class="mono" style="color:#fff;font-size:24px;animation:none">Workbench — Casier</p>'; });
    return 4.4;
  };
  SCENES.beos = function (r) {
    var cs = ["#e0584a", "#4caf50", "#3b79d8", "#ffcb00", "#8a5ca8", "#e08c32", "#5ab0c8", "#999"], h = "";
    cs.forEach(function (c, i) { h += '<span style="background:' + c + ';animation-delay:' + (0.4 + i * 0.35) + 's"></span>'; });
    r.innerHTML = '<div class="onglet">Casier</div><div class="carte">' + h + '</div><div class="fil"><i></i></div>';
    [392, 493.88, 587.33, 783.99, 987.77, 783.99, 587.33, 493.88].forEach(function (f, i) { ton(f, 0.4 + i * 0.35, 0.9, "sine", 0.12); ton(f * 2, 0.4 + i * 0.35, 0.4, "triangle", 0.03); });
    return 4.0;
  };
  SCENES.minitel = function (r) {
    r.innerHTML = '<div class="i-term mono"><span id="im-t"></span><span class="cur"></span></div>';
    var el = r.querySelector("#im-t");
    [[697, 1209], [770, 1477], [697, 1209], [852, 1336]].forEach(function (p, i) { dtmf(p[0], p[1], 0.5 + i * 0.28, 0.2); });
    taper(el, "Numérotation  3615…\n", 400, 45);
    for (var i = 0; i < 6; i++) ton(i % 2 ? 2100 : 1300, 2.0 + i * 0.2, 0.18, "sine", 0.08, 0, 0.005);
    bruit(2.0, 1.4, 1800, 0.05, 2);
    apres(2000, function () { el.textContent += "\nConnexion en cours"; });
    apres(3400, function () { el.innerHTML = '<span class="gros">3615</span><span class="gros">CASIER</span>\n<span class="inv"> ENVOI </span> pour continuer'; });
    ton(1300, 3.4, 0.45, "sine", 0.18, 0, 0.005);
    return 5.2;
  };
  SCENES.c64 = function (r) {
    r.innerHTML = '<div class="ecr mono" id="ic-t"></div>';
    var el = r.querySelector("#ic-t");
    apres(2100, function () { r.classList.add("fixe"); });
    taper(el, "\n    **** CASIER BASIC V1 ****\n\n 64K RAM SYSTEM  38911 BASIC BYTES FREE\n\nREADY.\n", 2200, 22, function () { el.insertAdjacentHTML("beforeend", '<span class="cur"></span>'); });
    ton(880, 2.1, 0.5, "triangle", 0.2, 440);
    for (var i = 0; i < 6; i++) ton(110 + i * 40, i * 0.35, 0.3, "sawtooth", 0.025);
    return 4.8;
  };
  SCENES.apple2 = function (r) {
    r.innerHTML = '<div class="i-term mono"><span id="ia-t"></span><span class="cur"></span></div>';
    var el = r.querySelector("#ia-t");
    ton(1000, 0.7, 0.14, "square", 0.12, 0, 0.002);
    taper(el, "CASIER ][\n\n", 1000, 80);
    for (var i = 0; i < 14; i++) bruit(1.8 + i * 0.12, 0.08, 220 + (i % 4) * 70, 0.1, 5);
    apres(1900, function () { el.textContent += "LECTURE DU DISQUE…\n"; });
    apres(3300, function () { el.textContent += "\nBIENVENUE DANS LE CASIER\n\n]"; });
    return 4.6;
  };
  SCENES.horizon = function (r) {
    r.innerHTML = '<div class="halo"></div><div class="masque"><h1>Casier.</h1></div><p>Tout. En un geste.</p><div class="trait"></div>';
    ton(55, 0.1, 3.6, "sine", 0.3, 110, 1.4); ton(82.4, 0.3, 3.4, "sine", 0.12, 0, 1.2);
    [659.25, 987.77, 1318.5].forEach(function (f, i) { ton(f, 1.2 + i * 0.22, 2.2, "sine", 0.09); });
    return 3.8;
  };
  SCENES.atomique = function (r) {
    r.innerHTML = '<div class="rayons"></div>' + atome() + '<h1>CASIER</h1><p>Le futur, version 1982</p><div class="grain"></div>';
    balayage(80, 440, 0.1, 1.8, 0.12);
    accord([220, 277.18, 329.63, 415.3], 1.7, 2.4, "sawtooth", 0.03, 0.05);
    ton(880, 1.7, 0.4, "square", 0.05); ton(1318.5, 2.1, 1.2, "triangle", 0.08);
    return 4.2;
  };

  /* ===== SECTION : Porte « appuie pour allumer », lecture, sortie ===== */
  var etat = null;
  function nettoyer() {
    timers.forEach(clearTimeout); timers = [];
    if (ctx && maitre) { try { maitre.gain.cancelScheduledValues(ctx.currentTime); maitre.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08); } catch (e) { /* ignoré */ } }
  }
  function sortir(noeud, fin) {
    if (!noeud || noeud.dataset.sorti) return;
    noeud.dataset.sorti = "1"; noeud.classList.add("fin"); nettoyer();
    setTimeout(function () { if (noeud.parentNode) noeud.parentNode.removeChild(noeud); }, reduit ? 20 : 480);
    if (fin) { var f = fin; fin = null; setTimeout(f, reduit ? 20 : 200); }
  }
  /* Lance l’intro du thème puis appelle fin(). Si l’intro est désactivée, fin() est appelée aussitôt. */
  function lancer(theme, fin) {
    var suite = function () { try { if (typeof fin === "function") fin(); } catch (e) { /* ignoré */ } };
    if (lire() === "off" || !SCENES[theme]) { suite(); return; }
    injecterStyle();
    var P = PORTES[theme] || PORTES["98"];
    var porte = document.createElement("div");
    porte.id = "intro-porte"; porte.className = "p-" + theme;
    porte.style.cssText = "background:" + P[0] + ";color:" + P[1];
    porte.setAttribute("role", "dialog"); porte.setAttribute("aria-label", "Allumer");
    porte.innerHTML = '<button id="intro-marche" type="button" aria-label="Allumer ' + P[3] + '">' + ICO_MARCHE + '</button>' +
      '<div>Appuie pour allumer ' + P[3] + '</div><label><input type="checkbox" id="intro-non" autocomplete="off"> Ne plus afficher l’intro</label>' +
      '<button type="button" class="intro-lien" id="intro-sans">Passer sans intro</button>';
    porte.querySelector("#intro-marche").style.color = P[1];
    document.body.appendChild(porte);
    var b = porte.querySelector("#intro-marche"); try { b.focus({ preventScroll: true }); } catch (e) { /* ignoré */ }
    function memoriser() { if (porte.querySelector("#intro-non").checked) ecrire("off"); }
    porte.querySelector("#intro-sans").addEventListener("click", function () { memoriser(); sortir(porte, suite); });
    b.addEventListener("click", function () {
      memoriser();
      /* Plein écran à ce premier geste (si le navigateur l’autorise). */
      try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {}); } catch (e) { /* ignoré */ }
      var c = audio(); if (c) { try { c.resume(); } catch (e) { /* ignoré */ } T0 = c.currentTime + 0.05; if (maitre) { maitre.gain.cancelScheduledValues(c.currentTime); maitre.gain.setValueAtTime(0.55, c.currentTime); } }
      var rac = document.createElement("div");
      rac.id = "intro"; rac.className = "i-" + theme; rac.setAttribute("aria-label", "Introduction animée");
      var passer = document.createElement("button"); passer.type = "button"; passer.className = "intro-lien passer"; passer.textContent = "Passer ⏵";
      passer.style.color = P[1];
      var duree = 4;
      try { duree = SCENES[theme](rac, c) || 4; } catch (e) { duree = 0.2; }
      rac.appendChild(passer);
      document.body.appendChild(rac);
      porte.classList.add("fin"); setTimeout(function () { if (porte.parentNode) porte.parentNode.removeChild(porte); }, 480);
      var fini = false;
      function terminer() { if (fini) return; fini = true; document.removeEventListener("keydown", cle, true); sortir(rac, suite); }
      function cle(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); terminer(); } }
      passer.addEventListener("click", terminer); rac.addEventListener("dblclick", terminer);
      document.addEventListener("keydown", cle, true);
      timers.push(setTimeout(terminer, (reduit ? 1.2 : duree) * 1000));
    });
  }

  window.INTROS = { lancer: lancer, reinitialiser: function () { ecrire("on"); }, theme: Object.keys(SCENES) };
})();
