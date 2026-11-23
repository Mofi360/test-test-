/* R701 – Murmelrennen „Welches Sternzeichen küsst am besten?“ [KI]
 * EINE Quelle für Bild (scene.js lädt diese Datei) und Ton (make_sfx.js require()t sie).
 * Deterministisch: eigener PRNG, feste Schritte (240 Hz), nur + - * / sqrt floor und eigene sin/cos
 * (Math.sin/cos sind in Node und Chromium nicht bitgleich – in einem chaotischen System liefe Bild und Ton auseinander).
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

  const NAMES = ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'];
  const XL = 70, XR = 960, CX = 515;

  const CFG = {
    seed: 26873,
    n: 12, r: 40, hz: 240, fps: 30,
    grav: 1180, vmax: 1400, drag: 0.10,
    eBall: 0.62, eWall: 0.38,
    rbGain: 0.5, rbFrom: 200, rbSpan: 800, rbMax: 1.6, // Rubber-Banding: wer hinten liegt, läuft etwas schneller (rein positionsabhängig, für jedes Zeichen gleich)
    leadEase: 0.08,                           // die Spitze läuft minimal langsamer, wenn sie weit vorn ist
    rotW: 2.5,                                // Drehzahl der Lippenstift-Balken (rad/s)
    gateP: 3.4, gateClosed: 1.7, gateMove: 0.32, // Kuss-Tor: Periode, Zeit zu, Fahrzeit
    stuckT: 1.6, loopT: 2.6, tail: 6.3,                   // Anti-Stuck-Zeit; Schlussbild nach dem letzten Zieleinlauf
    maxT: 75,
  };

  /** Strecke (unabhängig vom Seed). Alle Maße in Welt-Pixeln, y wächst nach unten. */
  function buildTrack() {
    const circles = [], segs = [], rotors = [], sections = [];
    const peg = (x, y, r, kind, e) => circles.push({ x, y, r, kind: kind || 'peg', e: e == null ? 0.55 : e });
    const seg = (x1, y1, x2, y2, r, kind, e) => segs.push({ x1, y1, x2, y2, r, kind: kind || 'ramp', e: e == null ? 0.35 : e });
    let y = 965;
    // 1 Nagelbrett
    sections.push({ id: 'plinko', name: 'Nagelbrett', y0: y - 120 });
    for (let row = 0; row < 15; row++, y += 132) {
      if (row % 2 === 0) [215, 365, 515, 665, 815].forEach(x => peg(x, y, 15));
      else { [290, 440, 590, 740].forEach(x => peg(x, y, 15)); peg(XL, y, 44, 'knob', 0.5); peg(XR, y, 44, 'knob', 0.5); }
    }
    // 2 rotierende Lippenstifte
    y += 150; sections.push({ id: 'rotor', name: 'Lippenstift-Mühle', y0: y - 190 });
    for (let k = 0; k < 8; k++, y += 340) {
      if (k % 2 === 0) { rotors.push({ x: 290, y, L: 112, r: 21, dir: 1 }); rotors.push({ x: 740, y, L: 112, r: 21, dir: -1 }); }
      else { rotors.push({ x: CX, y, L: 150, r: 21, dir: k % 4 === 1 ? -1 : 1 }); seg(XL, y - 120, 196, y - 10, 13, 'wedge'); seg(XR, y - 120, XR - 126, y - 10, 13, 'wedge'); }
    }
    // 3 Trichter mit Engstelle (zwei Puderdosen)
    y -= 110; sections.push({ id: 'funnel', name: 'Engstelle', y0: y });
    const fy = y + 400;
    seg(XL, fy - 300, 354, fy - 92, 12, 'funnel', 0.2); seg(XR, fy - 300, XR - 284, fy - 92, 12, 'funnel', 0.2);
    peg(346, fy, 95, 'puder', 0.25); peg(684, fy, 95, 'puder', 0.25);
    peg(CX, fy + 230, 24, 'heart', 0.6);
    const funnel = { y0: fy - 300, yNeck: fy };
    y = fy + 330;
    // 4 Zickzack-Rampen
    sections.push({ id: 'zigzag', name: 'Zickzack', y0: y - 60 });
    for (let k = 0; k < 4; k++, y += 330) {
      if (k % 2 === 0) seg(XL, y, 690, y + 170, 18, 'ramp'); else seg(XR, y, 340, y + 170, 18, 'ramp');
    }
    // 5 Kussmund-Bumper
    y += 40; sections.push({ id: 'bumper', name: 'Kussmünder', y0: y - 120 });
    const bump = (x, yy) => circles.push({ x, y: yy, r: 64, kind: 'bumper', e: 0.9, kick: 600 });
    for (let k = 0; k < 10; k++) { if (k % 2 === 0) { bump(285, y + k * 218); bump(745, y + k * 218); } else { bump(CX, y + k * 218); bump(XL, y + k * 218); bump(XR, y + k * 218); } }
    y += 9 * 218 + 290;
    // 6 Kuss-Tor
    sections.push({ id: 'gate', name: 'Kuss-Tor', y0: y - 120 });
    seg(XL, y, 300, y + 130, 14, 'shelf'); seg(XR, y, 730, y + 130, 14, 'shelf');
    const gate = { y: y + 130, xl: 300, xr: 730, r: 22 };
    y += 330;
    // 7 Schlussgerade
    sections.push({ id: 'final', name: 'Schlussgerade', y0: y - 120 });
    for (let k = 0; k < 6; k++) (k % 2 ? [180, 400, 630, 850] : [290, 515, 740]).forEach(x => peg(x, y + k * 185, 24, 'heart', 0.6));
    y += 5 * 185 + 300;
    rotors.push({ x: 290, y, L: 112, r: 21, dir: -1 }); rotors.push({ x: 740, y, L: 112, r: 21, dir: 1 });
    [180, 400, 630, 850].forEach(x => peg(x, y + 270, 24, 'heart', 0.6));
    [290, 515, 740].forEach(x => peg(x, y + 455, 24, 'heart', 0.6));
    rotors.push({ x: CX, y: y + 740, L: 165, r: 21, dir: 1 });
    y += 740 + 400;
    const fin = y;
    sections.push({ id: 'ziel', name: 'Ziel', y0: fin });
    const floorY = fin + 450;
    seg(XL, floorY - 30, CX, floorY + 10, 14, 'floor', 0.2); seg(XR, floorY - 30, CX, floorY + 10, 14, 'floor', 0.2);
    for (let i = 0; i < sections.length; i++) sections[i].y1 = i + 1 < sections.length ? sections[i + 1].y0 : floorY;
    // Raster für schnelle Kollisionssuche
    const band = 200, grid = [];
    const put = (o, a, b, type, idx) => { for (let k = Math.floor((a - 60) / band); k <= Math.floor((b + 60) / band); k++) { if (k < 0) continue; (grid[k] || (grid[k] = [])).push({ type, idx }); } };
    circles.forEach((c, i) => put(c, c.y - c.r, c.y + c.r, 0, i));
    segs.forEach((s, i) => put(s, Math.min(s.y1, s.y2) - s.r, Math.max(s.y1, s.y2) + s.r, 1, i));
    return { XL, XR, CX, circles, segs, rotors, gate, funnel, fin, floorY, sections, band, grid, startY: 640 };
  }
  const TRACK = buildTrack();

  /** Öffnung des Kuss-Tors 0 (zu) .. 1 (offen) zur Zeit t */
  function gateOpen(t, c, ph) {
    let u = t + ph; u -= c.gateP * Math.floor(u / c.gateP);
    const m = c.gateMove, zu = c.gateClosed;
    let k;
    if (u < zu) k = 0;
    else if (u < zu + m) k = (u - zu) / m;
    else if (u < c.gateP - m) k = 1;
    else k = (c.gateP - u) / m;
    return k * k * (3 - 2 * k);
  }

  function simulate(seed, o) {
    const c = Object.assign({}, CFG, o || {});
    const T = TRACK, n = c.n, R = c.r, dt = 1 / c.hz, sub = c.hz / c.fps;
    const rnd = mulberry32(seed * 7919 + 13);
    // Startplätze mischen
    const slot = []; for (let i = 0; i < n; i++) slot.push(i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const h = slot[i]; slot[i] = slot[j]; slot[j] = h; }
    const balls = [];
    for (let i = 0; i < n; i++) {
      const s = slot[i], col = s % 6, row = (s - col) / 6;
      balls.push({
        x: 142 + col * 149 + (rnd() - 0.5) * 14, y: T.startY + row * 160 + (rnd() - 0.5) * 20,
        vx: (rnd() - 0.5) * 420, vy: 380 + rnd() * 260, fin: -1, place: 0, ax: 0, ay: 0, bestT: 0, nud: 0, topY: 0, topT: 0,
      });
    }
    const rotPh = T.rotors.map(() => rnd() * TAU);
    const gatePh = rnd() * c.gateP;
    const frames = [], events = [], finish = [], leadChanges = [], nudges = [];
    let leader = -1, cand = -1, candT = 0, lastChange = -9, firstFinT = -1, lastFinT = -1, total = -1;
    const maxSteps = c.hz * c.maxT;
    const rc = new Array(T.rotors.length), rs = new Array(T.rotors.length);
    const ev = (t, type, a, s, x, y, b) => { events.push({ t, type, a, s, x, y, b: b == null ? -1 : b }); };

    for (let s = 0; s <= maxSteps; s++) {
      const t = s * dt;
      for (let k = 0; k < T.rotors.length; k++) { const a = rotPh[k] + T.rotors[k].dir * c.rotW * t; rc[k] = cos(a); rs[k] = sin(a); }
      const gk = gateOpen(t, c, gatePh), gk2 = gateOpen(t + dt, c, gatePh);
      const half = (T.gate.xr - T.gate.xl) / 2;
      const tipL = T.gate.xl + half * (1 - gk), tipR = T.gate.xr - half * (1 - gk);
      const tipV = -half * (gk2 - gk) / dt; // Geschwindigkeit der linken Spitze (rechte: −tipV)

      // Führung (nur unter denen, die noch unterwegs sind)
      let ly = -1e9, li = -1, l2 = -1e9;
      for (let i = 0; i < n; i++) { const b = balls[i]; if (b.fin >= 0) continue; if (b.y > ly) { l2 = ly; ly = b.y; li = i; } else if (b.y > l2) l2 = b.y; }
      const refY = finish.length ? T.fin : ly;

      if (s % sub === 0) {
        const f = new Array(n * 2);
        for (let i = 0; i < n; i++) { f[i * 2] = balls[i].x; f[i * 2 + 1] = balls[i].y; }
        frames.push(f);
        // Führungswechsel (entprellt): Kandidat muss 0,3 s vorn bleiben, frühestens 0,8 s nach dem letzten Wechsel
        if (!finish.length && li >= 0 && t >= 0.9) {
          if (leader < 0) { leader = li; leadChanges.push({ t, a: li, from: -1 }); lastChange = t; }
          else if (li !== leader) {
            if (cand !== li) { cand = li; candT = t; }
            else if (t - candT >= 0.3 && t - lastChange >= 0.8 && balls[li].y - balls[leader].y > 8) {
              leadChanges.push({ t, a: li, from: leader }); ev(t, 'lead', li, 1, balls[li].x, balls[li].y, leader);
              leader = li; lastChange = t; cand = -1;
            }
          } else cand = -1;
        }
        if (total > 0 && t >= total) break;
      }

      // Bewegung
      for (let i = 0; i < n; i++) {
        const b = balls[i];
        let ts = 1; // eigene Zeitlupe/Zeitraffer der Murmel
        if (b.fin < 0) {
          let back = (refY - b.y - c.rbFrom) / c.rbSpan; if (back < 0) back = 0; if (back > c.rbMax) back = c.rbMax;
          ts = 1 + c.rbGain * back;
          if (i === li && !finish.length) { let ah = (ly - l2 - 120) / 400; if (ah > 1) ah = 1; if (ah < 0) ah = 0; ts = 1 - c.leadEase * ah; }
        }
        const h = dt * ts;
        b.vy += c.grav * h;
        const dk = 1 - c.drag * h; b.vx *= dk; b.vy *= dk;
        const sp2 = b.vx * b.vx + b.vy * b.vy;
        if (sp2 > c.vmax * c.vmax) { const k = c.vmax / Math.sqrt(sp2); b.vx *= k; b.vy *= k; }
        b.x += b.vx * h; b.y += b.vy * h;
      }
      // Murmel–Murmel
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const A = balls[i], B = balls[j];
        const dy = B.y - A.y; if (dy > 2 * R || dy < -2 * R) continue;
        const dx = B.x - A.x, d2 = dx * dx + dy * dy, m = 2 * R;
        if (d2 >= m * m || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (m - d) / 2;
        A.x -= nx * pen; A.y -= ny * pen; B.x += nx * pen; B.y += ny * pen;
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) {
          const e = rv > -60 ? 0 : c.eBall, j2 = -(1 + e) * rv / 2;
          A.vx -= j2 * nx; A.vy -= j2 * ny; B.vx += j2 * nx; B.vy += j2 * ny;
          if (rv < -70) ev(t, 'bb', i, -rv, A.x + nx * R, A.y + ny * R, j);
        }
      }
      // Murmel–Strecke
      for (let i = 0; i < n; i++) {
        const b = balls[i];
        const cell = T.grid[Math.floor(b.y / T.band)];
        if (cell) for (let q = 0; q < cell.length; q++) {
          const it = cell[q];
          if (it.type === 0) {
            const p = T.circles[it.idx], dx = b.x - p.x, dy = b.y - p.y, m = R + p.r, d2 = dx * dx + dy * dy;
            if (d2 >= m * m || d2 === 0) continue;
            const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
            b.x = p.x + nx * m; b.y = p.y + ny * m;
            const vn = b.vx * nx + b.vy * ny;
            if (vn < 0) {
              let out = -vn * (vn > -60 ? 0 : p.e);
              if (p.kick && vn < -40) { if (out < p.kick) out = p.kick; }
              b.vx += (out - vn) * nx; b.vy += (out - vn) * ny;
              if (vn < -70) ev(t, p.kind, i, -vn, p.x + nx * p.r, p.y + ny * p.r, it.idx);
            }
          } else {
            const sg = T.segs[it.idx];
            hitCapsule(b, sg.x1, sg.y1, sg.x2, sg.y2, sg.r, sg.e, 0, 0, 0, 0, 0, t, sg.kind, i, it.idx);
          }
        }
        for (let k = 0; k < T.rotors.length; k++) {
          const ro = T.rotors[k]; const dyy = b.y - ro.y; if (dyy > ro.L + ro.r + R + 4 || dyy < -(ro.L + ro.r + R + 4)) continue;
          hitCapsule(b, ro.x - rc[k] * ro.L, ro.y - rs[k] * ro.L, ro.x + rc[k] * ro.L, ro.y + rs[k] * ro.L, ro.r, 0.5, ro.dir * c.rotW, ro.x, ro.y, 0, 0, t, 'rotor', i, k);
        }
        const gy = T.gate.y, dg = b.y - gy;
        if (dg < R + T.gate.r + 4 && dg > -(R + T.gate.r + 4)) {
          hitCapsule(b, T.gate.xl, gy, tipL, gy, T.gate.r, 0.3, 0, 0, 0, tipV * 0.6, 0, t, 'gate', i, 0);
          hitCapsule(b, T.gate.xr, gy, tipR, gy, T.gate.r, 0.3, 0, 0, 0, -tipV * 0.6, 0, t, 'gate', i, 1);
        }
        // Seitenwände
        if (b.x < XL + R) { b.x = XL + R; if (b.vx < 0) { if (b.vx < -90) ev(t, 'wall', i, -b.vx, XL, b.y); b.vx = -b.vx * c.eWall; } }
        else if (b.x > XR - R) { b.x = XR - R; if (b.vx > 0) { if (b.vx > 90) ev(t, 'wall', i, b.vx, XR, b.y); b.vx = -b.vx * c.eWall; } }
      }
      // Ziel + Anti-Stuck
      for (let i = 0; i < n; i++) {
        const b = balls[i]; if (b.fin >= 0) continue;
        if (b.y >= T.fin) {
          b.fin = t; b.place = finish.length + 1; finish.push({ i, t, x: b.x });
          ev(t, 'finish', i, b.place, b.x, T.fin);
          if (firstFinT < 0) firstFinT = t;
          if (finish.length === n) { lastFinT = t; total = Math.ceil((t + c.tail) * c.fps) / c.fps; }
          continue;
        }
        // Anti-Stuck: kaum vom Fleck gekommen? → sanfter Stoß. Wer nur vor dem geschlossenen Tor oder hinten im Stau wartet, bleibt in Ruhe.
        const ax = b.x - b.ax, ay = b.y - b.ay;
        const waits = (b.y > T.gate.y - 460 && b.y < T.gate.y && gk < 0.6) || (b.y > T.funnel.y0 - 200 && b.y < T.funnel.yNeck - 150);
        if (b.y > b.topY + 40 || waits) { b.topY = b.y > b.topY ? b.y : b.topY; b.topT = t; }
        if (t - b.topT > c.loopT) {
          // dreht sich im Kreis (z. B. zwischen Kussmund und Wand)? → Stoß nach unten Richtung Bahnmitte
          b.vx = (b.x < CX ? 1 : -1) * (120 + rnd() * 160); b.vy = 260 + rnd() * 120;
          b.nud++; nudges.push({ t, i, x: b.x, y: b.y }); ev(t, 'nudge', i, 1, b.x, b.y);
          b.topT = t - c.loopT * 0.6;
        }
        if (ax * ax + ay * ay > 1600 || waits) { b.ax = b.x; b.ay = b.y; b.bestT = t; }
        else if (t - b.bestT > c.stuckT && b.vx * b.vx + b.vy * b.vy < 8100) {
          const sgn = rnd() < 0.5 ? -1 : 1;
          b.vx += sgn * (200 + rnd() * 220); b.vy = -(160 + rnd() * 200);
          b.nud++; nudges.push({ t, i, x: b.x, y: b.y }); ev(t, 'nudge', i, 1, b.x, b.y);
          b.bestT = t - c.stuckT * 0.45;
        }
      }
    }

    function hitCapsule(b, x1, y1, x2, y2, r, e, w, cx, cy, svx, svy, t, kind, i, idx) {
      const ex = x2 - x1, ey = y2 - y1, l2 = ex * ex + ey * ey;
      let u = l2 > 0 ? ((b.x - x1) * ex + (b.y - y1) * ey) / l2 : 0; if (u < 0) u = 0; else if (u > 1) u = 1;
      const qx = x1 + ex * u, qy = y1 + ey * u, dx = b.x - qx, dy = b.y - qy, m = R + r, d2 = dx * dx + dy * dy;
      if (d2 >= m * m || d2 === 0) return;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
      b.x = qx + nx * m; b.y = qy + ny * m;
      // Geschwindigkeit der Oberfläche (Drehung um cx,cy oder Schub)
      const ux = svx - w * (qy - cy) * (w ? 1 : 0), uy = svy + w * (qx - cx) * (w ? 1 : 0);
      const vn = (b.vx - ux) * nx + (b.vy - uy) * ny;
      if (vn < 0) {
        const ee = vn > -60 ? 0 : e;
        b.vx -= (1 + ee) * vn * nx; b.vy -= (1 + ee) * vn * ny;
        if (vn < -70) ev(t, kind, i, -vn, qx + nx * r, qy + ny * r, idx);
      }
    }

    const tWin = firstFinT;
    return {
      cfg: c, seed, track: T, names: NAMES, frames, events, finish, leadChanges, nudges, rotPh, gatePh,
      tWin, tLast: lastFinT, total, ok: finish.length === n,
      rotAngle: (k, t) => rotPh[k] + T.rotors[k].dir * c.rotW * t,
      gateOpen: t => gateOpen(t, c, gatePh),
    };
  }
  const API = { CFG, NAMES, TRACK, simulate, mulberry32, sin, cos };
  g.R701SIM = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
