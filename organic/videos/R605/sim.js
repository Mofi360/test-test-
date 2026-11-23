/* R605 – Wettkampf-Simulation [KI]
 * EINE Quelle für Bild (scene.js lädt diese Datei) und Ton (make_sfx.js require()t sie).
 * Deterministisch: eigener PRNG, feste Schritte (240 Hz), nur + - * / sqrt floor (bitgleich in Node und Browser).
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
  // Eigene Winkelfunktionen (nur Grundrechenarten): Math.sin/cos/atan2 liefern in Node und Chromium
  // nicht bitgleiche Werte – in einem chaotischen System liefe sonst Bild und Ton auseinander.
  const PI = 3.141592653589793, TAU = 6.283185307179586;
  function sin(x) {
    x -= TAU * Math.floor((x + PI) / TAU);
    if (x > PI / 2) x = PI - x; else if (x < -PI / 2) x = -PI - x;
    const q = x * x;
    return x * (1 - q / 6 * (1 - q / 20 * (1 - q / 42 * (1 - q / 72 * (1 - q / 110 * (1 - q / 156 * (1 - q / 210)))))));
  }
  const cos = x => sin(x + PI / 2);

  const CFG = {
    seed: 932,
    names: ['Kaffee', 'Kuss', 'Burger', 'Regen', 'Weinglas', 'Pasta'],
    cx: 540, cy: 975, R: 380, r: 78, wall: 9,
    hz: 240, fps: 30,
    omega: 0.62,            // Ring-Drehung rad/s
    g0: 0.275, g1: 0.004, gMax: 0.45, // halbe Lückenbreite (rad): Start, Wachstum pro s, Maximum
    grav: 260, v0: 540, v1: 7,      // Schwerkraft, Zieltempo + Zuwachs pro s
    close: 0.5,             // Lücke schließt sich nach dem Sieg (s)
    tail: 4.7,              // Schlussbild nach dem Sieg (s)
  };

  function simulate(seed, o) {
    const c = Object.assign({}, CFG, o || {});
    const rnd = mulberry32(seed);
    const n = c.names.length, dt = 1 / c.hz, sub = c.hz / c.fps;
    const phi0 = rnd() * TAU;
    const a0 = rnd() * TAU;
    const balls = [];
    for (let i = 0; i < n; i++) {
      const a = a0 + i * TAU / n, rad = 205 + rnd() * 30;
      const va = rnd() * TAU, sp = c.v0 * (0.85 + rnd() * 0.3);
      balls.push({ x: c.cx + cos(a) * rad, y: c.cy + sin(a) * rad, vx: cos(va) * sp, vy: sin(va) * sp, alive: true, outT: -1 });
    }
    const frames = [], events = [], outs = [];
    let alive = n, tWin = -1, gWin = 0, winner = -1;
    const maxSteps = c.hz * 70;
    for (let s = 0; s <= maxSteps; s++) {
      const t = s * dt;
      const rot = phi0 + c.omega * t;
      let gap = c.g0 + c.g1 * t; if (gap > c.gMax) gap = c.gMax;
      if (tWin >= 0) { let k = (t - tWin) / c.close; if (k > 1) k = 1; gap = gWin * (1 - k); }
      if (s % sub === 0) {
        const f = new Array(n * 2);
        for (let i = 0; i < n; i++) { f[i * 2] = balls[i].x; f[i * 2 + 1] = balls[i].y; }
        frames.push(f);
        if (tWin >= 0 && t >= tWin + c.tail) break;
      }
      // Bewegung
      for (let i = 0; i < n; i++) {
        const b = balls[i];
        b.vy += (b.alive ? c.grav : 2200) * dt;
        b.x += b.vx * dt; b.y += b.vy * dt;
      }
      // Kugel–Kugel
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const A = balls[i], B = balls[j];
        if (!A.alive || !B.alive) continue;
        const dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy, m = 2 * c.r;
        if (d2 >= m * m || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (m - d) / 2;
        A.x -= nx * pen; A.y -= ny * pen; B.x += nx * pen; B.y += ny * pen;
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) {
          A.vx += rv * nx; A.vy += rv * ny; B.vx -= rv * nx; B.vy -= rv * ny;
          events.push({ t, type: 'bb', a: i, b: j, s: -rv, x: A.x + nx * c.r, y: A.y + ny * c.r });
        }
      }
      // Kugel–Ring (Bogen mit Lücke) + Ausscheiden
      for (let i = 0; i < n; i++) {
        const b = balls[i]; if (!b.alive) continue;
        const dx = b.x - c.cx, dy = b.y - c.cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 1) continue;
        const cr = cos(rot), sr = sin(rot);
        const cda = (dx * cr + dy * sr) / d, side = cr * dy - sr * dx; // cos des Winkels zur Lückenmitte, Seite
        const inGap = cda > cos(gap);
        if (!inGap) {
          const lim = c.R - c.r - c.wall;
          if (d > lim) {
            const nx = -dx / d, ny = -dy / d;
            b.x = c.cx - nx * lim; b.y = c.cy - ny * lim;
            const vn = b.vx * nx + b.vy * ny;
            if (vn < 0) { b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; events.push({ t, type: 'wall', a: i, s: -vn, x: c.cx - nx * c.R, y: c.cy - ny * c.R }); }
          }
        } else {
          if (d > c.R + c.r * 0.3) {
            b.alive = false; b.outT = t; alive--; outs.push({ i, t });
            events.push({ t, type: 'out', a: i, s: 1 });
            if (alive === 1) { tWin = t; gWin = gap; for (let k = 0; k < n; k++) if (balls[k].alive) winner = k; events.push({ t, type: 'win', a: winner, s: 1 }); }
            continue;
          }
          const ea = rot + (side < 0 ? -gap : gap);
          const px = c.cx + cos(ea) * c.R, py = c.cy + sin(ea) * c.R;
          const ex = b.x - px, ey = b.y - py, ed = Math.sqrt(ex * ex + ey * ey), m = c.r + c.wall;
          if (ed < m && ed > 0) {
            const nx = ex / ed, ny = ey / ed;
            b.x = px + nx * m; b.y = py + ny * m;
            const vn = b.vx * nx + b.vy * ny;
            if (vn < 0) { b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; events.push({ t, type: 'wall', a: i, s: -vn, x: px, y: py }); }
          }
        }
      }
      // Tempo halten (nie einschlafen, nie rasen)
      const target = c.v0 + c.v1 * (tWin >= 0 ? tWin : t);
      for (let i = 0; i < n; i++) {
        const b = balls[i]; if (!b.alive) continue;
        const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (sp < 0.6 * target) { const k = 1 + 3 * dt; b.vx *= k; b.vy *= k; if (sp < 1) { b.vx += 5; b.vy -= 5; } }
        else if (sp > 1.4 * target) { const k = 1 - 3 * dt; b.vx *= k; b.vy *= k; }
      }
    }
    return { cfg: c, seed, phi0, frames, events, outs, tWin, gWin, winner, total: tWin < 0 ? -1 : tWin + c.tail,
      rotAt: t => phi0 + c.omega * t,
      gapAt: t => { if (tWin >= 0 && t >= tWin) { let k = (t - tWin) / c.close; if (k > 1) k = 1; return gWin * (1 - k); } const gp = c.g0 + c.g1 * t; return gp > c.gMax ? c.gMax : gp; } };
  }
  const API = { CFG, simulate, mulberry32 };
  g.R605SIM = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
