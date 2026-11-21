/*
  Projet : Casier V2 à V4 — petits logiciels d’époque (Démineur et Lecteur audio)
  Version : 1.0.0  ·  Date : 21/11/2026  ·  Licence : CC BY-NC 4.0
  Auteur : Tom Rougeaud
  Réalisé avec l’aide de l’IA : Claude Sonnet 5.5 (Anthropic)

  Ce fichier est partagé par les versions /98, /xp et /macintosh. Il ne dépend de rien d’extérieur :
  - le Démineur est un jeu de réflexion classique (règles génériques), dessiné ici de A à Z ;
  - le Lecteur audio ne lit aucun fichier : il fabrique de courtes mélodies originales avec Web Audio
    (aucune musique existante, aucun son d’un système d’exploitation) ;
  - rien n’est enregistré ni envoyé : tout reste dans la page.
  Utilisation : LOGICIELS.demineur(conteneur, "win" | "mac") et LOGICIELS.lecteur(conteneur, "win" | "mac").
*/
(function () {
  "use strict";

  /* ===== SECTION : Outils communs ===== */
  /* Crée un élément avec classe et texte (jamais de HTML saisi). */
  function el(balise, classe, texte) {
    var e = document.createElement(balise);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    return e;
  }

  /* Feuille de style injectée une seule fois (le thème « win » ou « mac » change l’aspect). */
  var CSS = [
    ".lg{display:flex;flex-direction:column;gap:8px;padding:8px;background:#c0c0c0;color:#000;font:12px Tahoma,Geneva,Verdana,sans-serif;user-select:none;-webkit-user-select:none;overflow:auto;height:100%}",
    ".lg button{font:inherit;color:inherit}",
    ".lg-rel{border:2px solid;border-color:#fff #808080 #808080 #fff;background:#c0c0c0}",
    ".lg-cre{border:2px solid;border-color:#808080 #fff #fff #808080}",
    ".lg-haut{display:flex;align-items:center;justify-content:space-between;padding:4px}",
    ".lg-chiffres{font:bold 20px/1 \"Courier New\",monospace;background:#1b1b1b;color:#e0463a;padding:3px 5px;min-width:52px;text-align:center;letter-spacing:2px}",
    ".lg-visage{width:34px;height:34px;padding:0;font:bold 14px/1 \"Courier New\",monospace;cursor:pointer}",
    ".lg-grille{display:grid;width:max-content;margin:0 auto}",
    ".lg-c{width:26px;height:26px;padding:0;margin:0;font:bold 14px/1 Tahoma,Verdana,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:manipulation}",
    ".lg-c.ouv{border:1px solid #808080;background:#c0c0c0;cursor:default}",
    ".lg-c.mine{background:#e8a29c}",
    ".lg-c[data-n=\"1\"]{color:#1f4fbf}.lg-c[data-n=\"2\"]{color:#2c7a2c}.lg-c[data-n=\"3\"]{color:#b3261e}.lg-c[data-n=\"4\"]{color:#1a1a7a}",
    ".lg-c[data-n=\"5\"]{color:#7a1a1a}.lg-c[data-n=\"6\"]{color:#1a7a7a}.lg-c[data-n=\"7\"]{color:#000}.lg-c[data-n=\"8\"]{color:#666}",
    ".lg-bas{display:flex;gap:6px;flex-wrap:wrap;align-items:center}",
    ".lg-bt{padding:3px 10px;min-height:26px;cursor:pointer}",
    ".lg-bt[aria-pressed=\"true\"]{border-color:#808080 #fff #fff #808080;background:#b4b4b4}",
    ".lg-msg{min-height:16px;text-align:center}",
    /* Lecteur audio */
    ".lg-lect{background:#2b3a55;color:#dfe8f5}",
    ".lg-ecran{background:#0f1726;border:2px solid #0a0f1a;border-radius:4px;padding:6px;display:flex;flex-direction:column;gap:4px}",
    ".lg-ecran canvas{width:100%;height:84px;display:block;background:#0f1726}",
    ".lg-titre{font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".lg-temps{font:12px \"Courier New\",monospace;color:#9fb6d8}",
    ".lg-prog{height:8px;background:#1a2640;border-radius:4px;overflow:hidden}",
    ".lg-prog i{display:block;height:100%;width:0;background:#6f9fe0}",
    ".lg-trans{display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
    ".lg-tb{width:38px;height:30px;padding:0;border:1px solid #1a2640;border-radius:5px;background:linear-gradient(#5b78a8,#3d5784);color:#fff;cursor:pointer}",
    ".lg-trans input[type=range]{flex:1;min-width:70px}",
    ".lg-liste{list-style:none;margin:0;padding:0;border:1px solid #1a2640;border-radius:4px;background:#17233a}",
    ".lg-liste li button{display:flex;justify-content:space-between;width:100%;background:none;border:0;color:#dfe8f5;padding:5px 8px;text-align:left;cursor:pointer}",
    ".lg-liste li button[aria-current=\"true\"]{background:#3b6fc0;color:#fff}",
    /* Thème « mac » (aspect arrondi des années 2000) */
    ".lg.mac{background:#ececec;font-family:\"Lucida Grande\",Geneva,Verdana,sans-serif}",
    ".mac .lg-rel,.mac .lg-cre{border:1px solid #8a9ab5;border-radius:8px;background:linear-gradient(#fdfdfd,#dfe6f1)}",
    ".mac .lg-c{border:1px solid #9aa9c4;border-radius:4px;background:linear-gradient(#f7faff,#c9d8ee)}",
    ".mac .lg-c.ouv{background:#f4f6fa;border-color:#c3cbda}",
    ".mac .lg-c.mine{background:#f1b8b2}",
    ".mac .lg-bt,.mac .lg-visage{border:1px solid #6f8fc4;border-radius:14px;background:linear-gradient(#ffffff,#cfe0f7)}",
    ".mac .lg-bt[aria-pressed=\"true\"]{background:linear-gradient(#9cc2f2,#4f86d8);color:#fff}",
    ".lg.lg-lect.mac{background:#33445f}"
  ].join("\n");
  function injecterCss() {
    if (document.getElementById("lg-css")) return;
    var s = el("style"); s.id = "lg-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ===== SECTION : Démineur ===== */
  var NIVEAUX = { debutant: { l: 9, h: 9, m: 10, nom: "Débutant" }, moyen: { l: 16, h: 12, m: 30, nom: "Intermédiaire" } };

  function demineur(conteneur, theme) {
    injecterCss();
    var racine = el("div", "lg " + (theme === "mac" ? "mac" : "win"));
    var niveau = NIVEAUX.debutant, cases = [], mines = [], compte = [], ouvertes = [], drapeaux = [];
    var fini = false, commence = false, restantes = 0, secondes = 0, minuteur = null, modeDrapeau = false;

    var haut = el("div", "lg-haut lg-cre"), cMines = el("div", "lg-chiffres", "010"), visage = el("button", "lg-visage lg-rel", ":)");
    visage.type = "button"; visage.setAttribute("aria-label", "Nouvelle partie");
    var cTemps = el("div", "lg-chiffres", "000");
    haut.appendChild(cMines); haut.appendChild(visage); haut.appendChild(cTemps);
    var grille = el("div", "lg-grille lg-cre");
    var bas = el("div", "lg-bas"), msg = el("div", "lg-msg", "Clique pour déchiffrer la grille.");
    racine.appendChild(haut); racine.appendChild(grille); racine.appendChild(bas); racine.appendChild(msg);

    function trois(n) { n = Math.max(-99, Math.min(999, n)); return (n < 0 ? "-" + ("0" + Math.abs(n)).slice(-2) : ("00" + n).slice(-3)); }
    function voisins(i) {
      var x = i % niveau.l, y = Math.floor(i / niveau.l), r = [];
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < niveau.l && ny < niveau.h) r.push(ny * niveau.l + nx);
      }
      return r;
    }
    function arreter() { clearInterval(minuteur); minuteur = null; }
    function nouvelle(nv) {
      if (nv) niveau = nv;
      arreter(); fini = false; commence = false; secondes = 0; cTemps.textContent = "000";
      var total = niveau.l * niveau.h; restantes = niveau.m; cMines.textContent = trois(restantes);
      mines = []; compte = []; ouvertes = []; drapeaux = []; cases = [];
      for (var i = 0; i < total; i++) { mines.push(false); compte.push(0); ouvertes.push(false); drapeaux.push(false); }
      grille.textContent = ""; grille.style.gridTemplateColumns = "repeat(" + niveau.l + ",26px)";
      for (var k = 0; k < total; k++) {
        (function (idx) {
          var b = el("button", "lg-c lg-rel"); b.type = "button"; b.setAttribute("aria-label", "Case " + (idx + 1));
          var appui = null, long = false;
          b.addEventListener("pointerdown", function (e) {
            if (e.pointerType === "touch") { long = false; appui = setTimeout(function () { long = true; poserDrapeau(idx); }, 450); }
          });
          function relache() { clearTimeout(appui); }
          b.addEventListener("pointerup", relache); b.addEventListener("pointerleave", relache);
          b.addEventListener("click", function () { if (long) { long = false; return; } if (modeDrapeau) poserDrapeau(idx); else ouvrir(idx); });
          b.addEventListener("contextmenu", function (e) { e.preventDefault(); poserDrapeau(idx); });
          grille.appendChild(b); cases.push(b);
        })(k);
      }
      visage.textContent = ":)"; msg.textContent = "Clique pour déchiffrer la grille.";
    }
    /* Place les mines après le premier clic, en évitant cette case et ses voisines. */
    function semer(depart) {
      var interdit = voisins(depart), total = niveau.l * niveau.h, posees = 0; interdit.push(depart);
      while (posees < niveau.m) {
        var i = Math.floor(Math.random() * total);
        if (mines[i] || interdit.indexOf(i) !== -1) continue;
        mines[i] = true; posees++;
      }
      for (var j = 0; j < total; j++) { var n = 0; voisins(j).forEach(function (v) { if (mines[v]) n++; }); compte[j] = n; }
    }
    function poserDrapeau(i) {
      if (fini || ouvertes[i]) return;
      drapeaux[i] = !drapeaux[i]; cases[i].textContent = drapeaux[i] ? "⚑" : "";
      restantes += drapeaux[i] ? -1 : 1; cMines.textContent = trois(restantes);
    }
    function montrer(i) {
      var b = cases[i]; ouvertes[i] = true; b.className = "lg-c ouv"; b.textContent = "";
      if (compte[i] > 0 && !mines[i]) { b.textContent = compte[i]; b.setAttribute("data-n", compte[i]); }
    }
    function ouvrir(depart) {
      if (fini || ouvertes[depart] || drapeaux[depart]) return;
      if (!commence) {
        commence = true; semer(depart);
        minuteur = setInterval(function () {
          if (!racine.isConnected) { arreter(); return; }
          secondes++; cTemps.textContent = trois(secondes);
        }, 1000);
      }
      if (mines[depart]) { perdre(depart); return; }
      var pile = [depart];
      while (pile.length) {
        var i = pile.pop(); if (ouvertes[i] || drapeaux[i]) continue;
        montrer(i);
        if (compte[i] === 0) voisins(i).forEach(function (v) { if (!ouvertes[v]) pile.push(v); });
      }
      var sures = 0; for (var k = 0; k < ouvertes.length; k++) if (ouvertes[k]) sures++;
      if (sures === ouvertes.length - niveau.m) gagner();
    }
    function perdre(i) {
      fini = true; arreter(); visage.textContent = "X(";
      for (var k = 0; k < mines.length; k++) if (mines[k]) { cases[k].className = "lg-c ouv mine"; cases[k].textContent = "✱"; }
      cases[i].style.outline = "2px solid #b3261e"; msg.textContent = "Boum ! Clique sur le visage pour rejouer.";
    }
    function gagner() {
      fini = true; arreter(); visage.textContent = "B)"; restantes = 0; cMines.textContent = "000";
      for (var k = 0; k < mines.length; k++) if (mines[k]) cases[k].textContent = "⚑";
      msg.textContent = "Bravo ! Grille déchiffrée en " + secondes + " s.";
    }
    visage.addEventListener("click", function () { nouvelle(); });
    var btFl = el("button", "lg-bt lg-rel", "Drapeau"); btFl.type = "button"; btFl.setAttribute("aria-pressed", "false");
    btFl.title = "Pour poser un drapeau au doigt (ou clic droit, ou appui long)";
    btFl.addEventListener("click", function () { modeDrapeau = !modeDrapeau; btFl.setAttribute("aria-pressed", String(modeDrapeau)); });
    bas.appendChild(btFl);
    Object.keys(NIVEAUX).forEach(function (c) {
      var b = el("button", "lg-bt lg-rel", NIVEAUX[c].nom); b.type = "button";
      b.addEventListener("click", function () { nouvelle(NIVEAUX[c]); });
      bas.appendChild(b);
    });
    conteneur.appendChild(racine); nouvelle(NIVEAUX.debutant);
  }

  /* ===== SECTION : Lecteur audio (mélodies synthétisées, originales) ===== */
  /* Chaque morceau : tempo, accords (notes MIDI), forme d’onde et motif d’arpège. */
  var MORCEAUX = [
    { titre: "Aube numérique", bpm: 96, onde: "triangle", motif: [0, 1, 2, 1, 0, 1, 2, 1], accords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]] },
    { titre: "Récré en pixels", bpm: 128, onde: "square", motif: [0, 2, 1, 2, 0, 2, 1, 2], accords: [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60]] },
    { titre: "Colline tranquille", bpm: 76, onde: "sine", motif: [0, 1, 2, 1, 2, 1, 0, 1], accords: [[53, 57, 60], [48, 52, 55], [55, 59, 62], [57, 60, 64]] },
    { titre: "Clapet en fête", bpm: 140, onde: "square", motif: [0, 1, 2, 0, 1, 2, 1, 0], accords: [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]] }
  ];
  var BARRES = 8;
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function mmss(s) { s = Math.max(0, Math.floor(s)); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }

  function lecteur(conteneur, theme) {
    injecterCss();
    var racine = el("div", "lg lg-lect " + (theme === "mac" ? "mac" : "win"));
    var ecran = el("div", "lg-ecran"), toile = el("canvas"); toile.width = 320; toile.height = 84;
    var titre = el("div", "lg-titre", "Prêt : choisis un morceau"), temps = el("div", "lg-temps", "00:00 / 00:00");
    var prog = el("div", "lg-prog"), barre = el("i"); prog.appendChild(barre);
    ecran.appendChild(toile); ecran.appendChild(titre); ecran.appendChild(prog); ecran.appendChild(temps);
    var trans = el("div", "lg-trans");
    function bouton(texte, nom, f) { var b = el("button", "lg-tb", texte); b.type = "button"; b.setAttribute("aria-label", nom); b.addEventListener("click", f); trans.appendChild(b); return b; }
    var liste = el("ul", "lg-liste");
    var ctx = null, analyseur = null, general = null, courant = 0, duree = 0, enPause = false, lecture = false, volume = 0.5, boutons = [];

    function dureeDe(m) { return BARRES * 4 * 60 / m.bpm; }
    function marquer() { boutons.forEach(function (b, i) { b.setAttribute("aria-current", i === courant ? "true" : "false"); }); }
    function arret() {
      lecture = false; enPause = false;
      if (ctx) { try { ctx.close(); } catch (e) { /* déjà fermé */ } }
      ctx = null; analyseur = null; general = null; barre.style.width = "0";
      temps.textContent = "00:00 / " + mmss(dureeDe(MORCEAUX[courant])); bPlay.textContent = "▶";
    }
    /* Programme toutes les notes du morceau sur l’horloge audio. */
    function jouer(n) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { titre.textContent = "Audio indisponible sur ce navigateur."; return; }
      if (ctx) { try { ctx.close(); } catch (e) { /* ignoré */ } }
      courant = n; var m = MORCEAUX[n]; duree = dureeDe(m); marquer();
      ctx = new AC(); general = ctx.createGain(); general.gain.value = volume * 0.3;
      analyseur = ctx.createAnalyser(); analyseur.fftSize = 64;
      general.connect(analyseur); analyseur.connect(ctx.destination);
      var croche = 30 / m.bpm, t0 = ctx.currentTime + 0.1;
      function note(f, debut, longueur, onde, vol) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = onde; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, debut); g.gain.exponentialRampToValueAtTime(vol, debut + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, debut + longueur);
        o.connect(g); g.connect(general); o.start(debut); o.stop(debut + longueur + 0.05);
      }
      for (var b = 0; b < BARRES; b++) {
        var ac = m.accords[b % m.accords.length], base = t0 + b * 8 * croche;
        note(hz(ac[0] - 12), base, croche * 3.6, "sine", 0.5); note(hz(ac[0] - 12), base + croche * 4, croche * 3.6, "sine", 0.4);
        for (var k = 0; k < 8; k++) note(hz(ac[m.motif[k]] + 12), base + k * croche, croche * 0.9, m.onde, 0.22);
        note(hz(ac[(b % 3)] + 24), base + croche * (b % 2 ? 2 : 0), croche * 3, "triangle", 0.18);
      }
      lecture = true; enPause = false; titre.textContent = m.titre + " — morceau original (synthèse)"; bPlay.textContent = "❚❚";
    }
    function suivant(d) { arret(); courant = (courant + d + MORCEAUX.length) % MORCEAUX.length; marquer(); jouer(courant); }
    var bPrec = bouton("◀◀", "Morceau précédent", function () { suivant(-1); });
    var bPlay = bouton("▶", "Lecture ou pause", function () {
      if (!ctx || !lecture) { jouer(courant); return; }
      if (enPause) { ctx.resume(); enPause = false; bPlay.textContent = "❚❚"; } else { ctx.suspend(); enPause = true; bPlay.textContent = "▶"; }
    });
    bouton("■", "Arrêt", function () { arret(); titre.textContent = "Arrêté : " + MORCEAUX[courant].titre; });
    var bSuiv = bouton("▶▶", "Morceau suivant", function () { suivant(1); });
    var vol = el("input"); vol.type = "range"; vol.min = "0"; vol.max = "100"; vol.value = "50"; vol.setAttribute("aria-label", "Volume");
    vol.addEventListener("input", function () { volume = vol.value / 100; if (general) general.gain.value = volume * 0.3; });
    trans.appendChild(vol);
    MORCEAUX.forEach(function (m, i) {
      var li = el("li"), b = el("button"); b.type = "button";
      b.appendChild(el("span", "", (i + 1) + ". " + m.titre)); b.appendChild(el("span", "", mmss(dureeDe(m))));
      b.addEventListener("click", function () { jouer(i); });
      li.appendChild(b); liste.appendChild(li); boutons.push(b);
    });
    racine.appendChild(ecran); racine.appendChild(trans); racine.appendChild(liste);
    racine.appendChild(el("div", "lg-msg", "Volume réglé doucement au départ."));
    conteneur.appendChild(racine); marquer(); temps.textContent = "00:00 / " + mmss(dureeDe(MORCEAUX[0]));

    /* Boucle d’affichage : barres de fréquences, progression, fin de morceau, arrêt si la fenêtre est fermée. */
    var g2 = toile.getContext("2d"), cases = new Uint8Array(32);
    (function image() {
      if (!racine.isConnected) { arret(); return; }
      if (!g2) { requestAnimationFrame(image); return; } /* pas de canvas : on garde le reste du lecteur */
      g2.fillStyle = "#0f1726"; g2.fillRect(0, 0, toile.width, toile.height);
      if (analyseur && lecture && !enPause) analyseur.getByteFrequencyData(cases); else for (var z = 0; z < cases.length; z++) cases[z] = cases[z] * 0.85;
      for (var i = 0; i < 32; i++) {
        var h = cases[i] / 255 * 76 + 2;
        g2.fillStyle = i % 2 ? "#6f9fe0" : "#8bb4ec"; g2.fillRect(i * 10 + 1, 82 - h, 8, h);
      }
      if (ctx && lecture) {
        var t = Math.min(duree, ctx.currentTime - 0.1); if (t < 0) t = 0;
        barre.style.width = (t / duree * 100) + "%"; temps.textContent = mmss(t) + " / " + mmss(duree);
        if (t >= duree - 0.05 && !enPause) suivant(1);
      }
      requestAnimationFrame(image);
    })();
  }

  /* ===== SECTION : Icônes dessinées à la main (couleurs calmes) ===== */
  var ICONES = {
    demineur: '<rect x="3" y="3" width="26" height="26" rx="3" fill="#c0c0c0" stroke="#5a5a5a" stroke-width="1.5"/><circle cx="16" cy="17" r="6" fill="#222"/><path d="M16 7v4M16 23v4M6 17h4M22 17h4M9 10l3 3M20 21l3 3M23 10l-3 3M12 21l-3 3" stroke="#222" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="15" r="1.6" fill="#fff"/>',
    musique: '<rect x="3" y="5" width="26" height="22" rx="3" fill="#2b3a55" stroke="#101a2c" stroke-width="1.5"/><path d="M13 21V10l9-2v10" fill="none" stroke="#9fc1f0" stroke-width="2"/><ellipse cx="11" cy="21" rx="3" ry="2.2" fill="#9fc1f0"/><ellipse cx="20" cy="18" rx="3" ry="2.2" fill="#9fc1f0"/>'
  };

  window.LOGICIELS = { demineur: demineur, lecteur: lecteur, icones: ICONES };
})();
