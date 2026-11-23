/* R702 – Battle-Royale der Geburtsmonate [KI]
 * EINE Quelle für Bild (scene.js lädt diese Datei) und Ton (make_sfx.js require()t sie).
 * Deterministisch: eigener PRNG, feste Schritte (240 Hz), nur + - * / sqrt floor – bitgleich in Node und Chromium.
 * Fair: alle 12 Monate haben dieselben Start-Lebenspunkte, denselben Radius, dieselbe Masse. Nichts hängt am Monat,
 * nur am Seed (Startplätze werden gemischt, Richtungen gewürfelt).
 */
(function (g) {
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const PI = 3.141592653589793, TAU = 6.283185307179586;
  function sin(x) {
    x -= TAU * Math.floor((x + PI) / TAU);
    if (x > PI / 2) x = PI - x; else if (x < -PI / 2) x = -PI - x;
    const q = x * x;
    return x * (1 - q / 6 * (1 - q / 20 * (1 - q / 42 * (1 - q / 72 * (1 - q / 110 * (1 - q / 156 * (1 - q / 210)))))));
  }
  const cos = x => sin(x + PI / 2);

  const CFG = {
    seed: 1,
    months: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'],
    enemies: ['Kaffee', 'Kuss', 'Burger', 'Regen', 'Weinglas', 'Pasta'],
    hz: 240, fps: 60, pre: 1.0,           // Vorlauf (s) vor t=0: alles ist bei t=0 schon in Bewegung, noch ohne Schaden
    cx: 505, cy: 972, hw: 455, hh: 450, rc: 150,   // Arena: abgerundetes Rechteck
    shrinkT0: 12, shrinkRate: 5.2, shrinkMax: 150, // Zone schrumpft ab 12 s
    rm: 58, re: 47, mm: 1, me: 1.7,       // Radien, Massen
    hp: 100,
    spawn: [-9, -9, -9, 5.5, 12.5, 20],   // wann welcher Gegner ins Feld kommt
    ghost: 0.5,                           // neu gespawnte Gegner tun 0,5 s nichts
    vm0: 400, vm1: 3.5,                   // Monats-Tempo
    ve0: 500, ve1: 9,                     // Gegner-Tempo
    home0: 520, home1: 26,                // Zielsuchen der Gegner (px/s²)
    cool: 1.0, coolEnd: 3, rageC: 0.45, calm: 1.2,               // nach einem Treffer ist der Gegner kurz „satt“: sucht nicht, schadet nicht
    focus: 0.35,                          // Zielwahl: Abstand × (focus + Rest-Lippenstift) – kleiner = jagt Angeschlagene
    inv: 0.38,                            // getroffener Monat ist kurz unverwundbar
    d0: 6, d1: 0.014, dT: 0.012, dMin: 4, dMax: 38, // Schaden = (d0 + d1*Aufprall) * (1 + dT*t) * Wut
    mmDiv: 500, mmMax: 1, mmCool: 0.6,                 // Monat gegen Monat: kleiner Schaden für beide
    rageT: 2.4, rageLen: 3.0, rageV: 0.35, rageD: 0.6, rageH: 1.0, // „Wut“: je länger keiner rausfliegt, desto härter
    tail: 6.0,
  };

  function simulate(seed, o) {
    const c = Object.assign({}, CFG, o || {});
    const lite = !!c.lite;
    const rnd = mulberry32(seed);
    const NM = c.months.length, NE = c.enemies.length, dt = 1 / c.hz, sub = c.hz / c.fps;
    // Startplätze: 4×3-Raster, Monate gemischt
    const slot = []; for (let i = 0; i < NM; i++) slot.push(i);
    for (let i = NM - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = slot[i]; slot[i] = slot[j]; slot[j] = x; }
    const M = [], E = [];
    for (let k = 0; k < NM; k++) {
      const col = k % 4, row = Math.floor(k / 4);
      const a = rnd() * TAU, sp = c.vm0 * (0.85 + rnd() * 0.3);
      M[slot[k]] = { x: c.cx + (col - 1.5) * 205 + (rnd() - 0.5) * 40, y: c.cy + (row - 1) * 270 + (rnd() - 0.5) * 40,
        vx: cos(a) * sp, vy: sin(a) * sp, hp: c.hp, alive: true, inv: -9, mmT: -9, outT: -1, lowT: -1 };
    }
    const ep = [[-205, -135], [205, -135], [0, 135], [0, 0], [0, 0], [0, 0]];
    for (let k = 0; k < NE; k++) {
      const a = rnd() * TAU;
      E.push({ x: c.cx + ep[k][0], y: c.cy + ep[k][1], vx: cos(a) * c.ve0, vy: sin(a) * c.ve0, on: c.spawn[k] < -1, born: c.spawn[k], cool: -9, tgt: -1 });
    }
    const frames = [], events = [], outs = [];
    let alive = NM, tWin = -1, winner = -1, lastOut = 0, insetWin = 0;
    const s0 = -Math.round(c.pre * c.hz), maxSteps = c.hz * 60;
    const inset = t => { if (tWin >= 0) return insetWin; if (t < c.shrinkT0) return 0; const v = (t - c.shrinkT0) * c.shrinkRate; return v > c.shrinkMax ? c.shrinkMax : v; };
    const rageAt = t => { let r = (t - lastOut - c.rageT) / c.rageLen; return r < 0 ? 0 : r > 1 ? 1 : r; };

    function wall(b, r, t, kind, idx) {
      const ins = inset(t), a = c.hw - ins, h = c.hh - ins, rc = c.rc;
      const dx = b.x - c.cx, dy = b.y - c.cy, ax = dx < 0 ? -dx : dx, ay = dy < 0 ? -dy : dy, sx = dx < 0 ? -1 : 1, sy = dy < 0 ? -1 : 1;
      const qx = ax - (a - rc), qy = ay - (h - rc);
      let nx = 0, ny = 0, hit = false;
      if (qx > 0 && qy > 0) {
        const d = Math.sqrt(qx * qx + qy * qy), lim = rc - r;
        if (d > lim) { nx = -sx * qx / d; ny = -sy * qy / d; b.x = c.cx + sx * (a - rc + qx / d * lim); b.y = c.cy + sy * (h - rc + qy / d * lim); hit = true; }
      } else if (ax > a - r && qx >= qy) { nx = -sx; b.x = c.cx + sx * (a - r); hit = true; }
      else if (ay > h - r) { ny = -sy; b.y = c.cy + sy * (h - r); hit = true; }
      if (hit) {
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) { b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; if (t >= 0 && -vn > 90) events.push({ t, type: 'wall', k: kind, i: idx, s: -vn, x: b.x - nx * r, y: b.y - ny * r }); }
      }
    }
    function kill(i, t) {
      const m = M[i]; m.alive = false; m.hp = 0; m.outT = t; alive--; lastOut = t;
      for (let k = 0; k < NE; k++) if (E[k].cool < t + c.calm) E[k].cool = t + c.calm;   // Atempause: alle Gegner sind kurz „satt“
      outs.push({ i, t, rank: alive + 1, x: m.x, y: m.y, left: alive });
      events.push({ t, type: 'out', m: i, rank: alive + 1, x: m.x, y: m.y });
      if (alive === 1) {
        for (let k = 0; k < NM; k++) if (M[k].alive) winner = k;
        insetWin = inset(t); tWin = t;
        events.push({ t, type: 'win', m: winner });
        for (let k = 0; k < NE; k++) if (E[k].on) { E[k].on = false; E[k].offT = t; }
      }
    }

    for (let s = s0; s <= maxSteps; s++) {
      const t = s * dt;
      if ((s - s0) % sub === 0) {
        if (!lite) {
          const f = new Array(NM * 3 + NE * 2);
          for (let i = 0; i < NM; i++) { f[i * 3] = M[i].x; f[i * 3 + 1] = M[i].y; f[i * 3 + 2] = M[i].hp; }
          for (let i = 0; i < NE; i++) { f[NM * 3 + i * 2] = E[i].x; f[NM * 3 + i * 2 + 1] = E[i].y; }
          frames.push(f);
        }
        if (tWin >= 0 && t >= tWin + c.tail) break;
      }
      const rage = tWin >= 0 ? 0 : rageAt(t);
      // Gegner erscheinen
      for (let k = 0; k < NE; k++) { const e = E[k]; if (!e.on && tWin < 0 && e.offT === undefined && t >= e.born) { e.on = true; events.push({ t, type: 'spawn', e: k, x: e.x, y: e.y }); } }
      // Gegner suchen den nächsten Monat
      const home = (c.home0 + c.home1 * t) * (1 + c.rageH * rage);
      for (let k = 0; k < NE; k++) {
        const e = E[k]; if (!e.on || t < e.cool || t < e.born + c.ghost) continue;
        // Ziel: nah UND angeschlagen (verschmierter Lippenstift zieht Feinde an)
        let best = -1, bs = 1e18, bd = 0;
        for (let i = 0; i < NM; i++) { const m = M[i]; if (!m.alive) continue; const dx = m.x - e.x, dy = m.y - e.y, d2 = dx * dx + dy * dy, w = c.focus + m.hp / c.hp, sc = d2 * w * w; if (sc < bs) { bs = sc; bd = d2; best = i; } }
        e.tgt = best;
        if (best >= 0 && bd > 1) { const d = Math.sqrt(bd), m = M[best]; e.vx += (m.x - e.x) / d * home * dt; e.vy += (m.y - e.y) / d * home * dt; }
      }
      // Bewegung
      for (let i = 0; i < NM; i++) { const m = M[i]; if (!m.alive) continue; m.x += m.vx * dt; m.y += m.vy * dt; }
      for (let k = 0; k < NE; k++) { const e = E[k]; if (!e.on) continue; e.x += e.vx * dt; e.y += e.vy * dt; }
      // Monat–Monat
      for (let i = 0; i < NM; i++) for (let j = i + 1; j < NM; j++) {
        const A = M[i], B = M[j]; if (!A.alive || !B.alive) continue;
        const dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy, md = 2 * c.rm;
        if (d2 >= md * md || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (md - d) / 2;
        A.x -= nx * pen; A.y -= ny * pen; B.x += nx * pen; B.y += ny * pen;
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) {
          A.vx += rv * nx; A.vy += rv * ny; B.vx -= rv * nx; B.vy -= rv * ny;
          let dmg = 0;
          if (t >= 0 && tWin < 0 && t - A.mmT > c.mmCool && t - B.mmT > c.mmCool) { dmg = Math.floor(-rv / c.mmDiv); if (dmg > c.mmMax) dmg = c.mmMax; }
          if (t >= 0) events.push({ t, type: 'mm', a: i, b: j, s: -rv, dmg, x: A.x + nx * c.rm, y: A.y + ny * c.rm });
          if (dmg > 0) {
            A.mmT = t; B.mmT = t;
            A.hp -= dmg; B.hp -= dmg;           // Rempler unter Monaten kosten etwas, werfen aber niemanden raus
            if (A.hp < 1) A.hp = 1; if (B.hp < 1) B.hp = 1;
            if (A.hp < c.hp * 0.1 && A.lowT < 0) A.lowT = t; if (B.hp < c.hp * 0.1 && B.lowT < 0) B.lowT = t;
          }
        }
      }
      // Gegner–Monat (Schaden)
      for (let k = 0; k < NE; k++) {
        const e = E[k]; if (!e.on) continue;
        const ghost = t < e.born + c.ghost;
        for (let i = 0; i < NM; i++) {
          const m = M[i]; if (!m.alive || ghost) continue;
          const dx = m.x - e.x, dy = m.y - e.y, d2 = dx * dx + dy * dy, md = c.rm + c.re;
          if (d2 >= md * md || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = md - d, wm = c.me / (c.mm + c.me), we = c.mm / (c.mm + c.me);
          m.x += nx * pen * wm; m.y += ny * pen * wm; e.x -= nx * pen * we; e.y -= ny * pen * we;
          const rv = (m.vx - e.vx) * nx + (m.vy - e.vy) * ny;
          if (rv < 0) {
            const jj = -2 * rv / (1 / c.mm + 1 / c.me);
            m.vx += jj / c.mm * nx; m.vy += jj / c.mm * ny; e.vx -= jj / c.me * nx; e.vy -= jj / c.me * ny;
            if (t >= 0 && t >= m.inv && t >= e.cool) {
              let dmg = Math.floor((c.d0 + c.d1 * -rv) * (1 + c.dT * t) * (1 + c.rageD * rage));
              if (dmg < c.dMin) dmg = c.dMin; if (dmg > c.dMax) dmg = c.dMax;
              m.hp -= dmg; m.inv = t + c.inv; e.cool = t + (c.cool + (c.coolEnd - c.cool) * (NM - alive) / (NM - 2)) * (1 - c.rageC * rage);
              if (m.hp < c.hp * 0.1 && m.lowT < 0) m.lowT = t;
              events.push({ t, type: 'hit', m: i, e: k, s: -rv, dmg, hp: m.hp > 0 ? m.hp : 0, x: e.x + nx * c.re, y: e.y + ny * c.re, nx, ny });
              if (m.hp <= 0) kill(i, t);
            } else if (t >= 0) events.push({ t, type: 'tap', m: i, e: k, s: -rv, x: e.x + nx * c.re, y: e.y + ny * c.re });
          }
        }
      }
      // Gegner–Gegner
      for (let i = 0; i < NE; i++) for (let j = i + 1; j < NE; j++) {
        const A = E[i], B = E[j]; if (!A.on || !B.on || t < A.born + c.ghost || t < B.born + c.ghost) continue;
        const dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy, md = 2 * c.re;
        if (d2 >= md * md || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (md - d) / 2;
        A.x -= nx * pen; A.y -= ny * pen; B.x += nx * pen; B.y += ny * pen;
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) { A.vx += rv * nx; A.vy += rv * ny; B.vx -= rv * nx; B.vy -= rv * ny; if (t >= 0) events.push({ t, type: 'ee', a: i, b: j, s: -rv, x: A.x + nx * c.re, y: A.y + ny * c.re }); }
      }
      // Wände
      for (let i = 0; i < NM; i++) if (M[i].alive) wall(M[i], c.rm, t, 'm', i);
      for (let k = 0; k < NE; k++) if (E[k].on) wall(E[k], c.re, t, 'e', k);
      // Tempo halten
      const tt = tWin >= 0 ? tWin : (t < 0 ? 0 : t);
      const vm = c.vm0 + c.vm1 * tt, ve = (c.ve0 + c.ve1 * tt) * (1 + c.rageV * rage);
      for (let i = 0; i < NM; i++) {
        const b = M[i]; if (!b.alive) continue;
        const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (sp < 0.7 * vm) { const k = 1 + 4 * dt; b.vx *= k; b.vy *= k; if (sp < 1) { b.vx += 5; b.vy -= 5; } }
        else if (sp > 1.5 * vm) { const k = 1 - 4 * dt; b.vx *= k; b.vy *= k; }
      }
      for (let i = 0; i < NE; i++) {
        const b = E[i]; if (!b.on) continue;
        const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (sp < 0.8 * ve) { const k = 1 + 5 * dt; b.vx *= k; b.vy *= k; if (sp < 1) { b.vx += 5; b.vy -= 5; } }
        else if (sp > 1.25 * ve) { const k = 1 - 6 * dt; b.vx *= k; b.vy *= k; }
      }
    }
    const lowT = M.map(m => m.lowT), outT = M.map(m => m.outT), hpEnd = M.map(m => m.hp);
    return { cfg: c, seed, frames, events, outs, tWin, winner, lowT, outT, hpEnd, insetWin, total: tWin < 0 ? -1 : tWin + c.tail,
      insetAt: t => { if (tWin >= 0 && t >= tWin) return insetWin; if (t < c.shrinkT0) return 0; const v = (t - c.shrinkT0) * c.shrinkRate; return v > c.shrinkMax ? c.shrinkMax : v; } };
  }
  const API = { CFG, simulate, mulberry32 };
  g.R702SIM = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
