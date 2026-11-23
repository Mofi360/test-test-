#!/usr/bin/env node
/* R703 – Fairness-Prüfung. [KI]  Nutzung: node organic/videos/R703/check.js
 * 1) Logik: genau EIN Abweichler je Level, nicht am Rand, Raster vollständig in x 60–950 / y 480–1520.
 * 2) Pixel: normaler vs. abweichender Lippenstift in Originalgröße (ohne Wackeln) rendern und Unterschied zählen. */
const path = require('path');
const G = require('./scene.js');
const { chromium } = require('playwright');
let ok = true; const fail = m => { ok = false; console.log('  FEHLER: ' + m); };
(async () => {
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 400, height: 400 } });
  for (const L of G.LV) {
    const lay = G.layout(L), odd = lay.items.filter(i => i.odd);
    console.log(`Level ${L.n}: ${L.cols}×${L.rows} = ${lay.items.length} Stück, Maßstab ${lay.sc.toFixed(3)} (Stift ca. ${(64 * lay.sc).toFixed(0)}×${(178 * lay.sc).toFixed(0)} px)`);
    if (odd.length !== 1) fail('Anzahl Abweichler = ' + odd.length);
    const o = odd[0];
    console.log(`  Abweichler: Zeile ${o.r + 1}, Spalte ${o.c + 1} (Art: ${L.kind}), Mitte x ${o.cx.toFixed(0)}, Standfläche y ${o.by.toFixed(0)}`);
    if (o.r === 0 || o.c === 0 || o.r === L.rows - 1 || o.c === L.cols - 1) fail('Abweichler liegt am Rand');
    // Wackeln: max. Drehung L.wob Grad, Bob 3.2*sc px → Hüllkasten
    const dx = 32 * lay.sc + Math.sin(L.wob * Math.PI / 180) * 178 * lay.sc, top = 178 * lay.sc + 3.2 * lay.sc, bot = 7 * lay.sc + 3.2 * lay.sc;
    const x0 = Math.min(...lay.items.map(i => i.cx - dx)), x1 = Math.max(...lay.items.map(i => i.cx + dx));
    const y0 = Math.min(...lay.items.map(i => i.by - top)), y1 = Math.max(...lay.items.map(i => i.by + bot));
    console.log(`  Rasterhülle inkl. Wackeln: x ${x0.toFixed(0)}–${x1.toFixed(0)}, y ${y0.toFixed(0)}–${y1.toFixed(0)}`);
    if (x0 < 60 || x1 > 950 || y0 < 480 || y1 > 1520) fail('Raster verlässt die erlaubte Fläche');
    if (dx * 2 > lay.cw) fail('Nachbarn können sich überlappen');
    if (L.R - L.T0 !== L.dur) fail('Timer und Auflösung passen nicht zusammen');
    // Pixelvergleich
    const W = Math.ceil(70 * lay.sc), H = Math.ceil(190 * lay.sc);
    const mk = v => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${G.defs('k')}<rect width="${W}" height="${H}" fill="#1C1420"/><g transform="translate(${W / 2} ${H - 8 * lay.sc}) scale(${lay.sc})">${G.lip('k', v)}</g></svg>`;
    const res = await page.evaluate(async ([a, c, W, H]) => {
      const px = async m => { const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(m); await im.decode(); const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, W, H).data; };
      const A = await px(a), B = await px(c); let n = 0, strong = 0, mx = 0;
      for (let i = 0; i < A.length; i += 4) { const d = Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2])); if (d > 6) n++; if (d > 60) strong++; if (d > mx) mx = d; }
      return { n, strong, mx, total: W * H };
    }, [mk(G.variant(L, false)), mk(G.variant(L, true)), W, H]);
    console.log(`  Pixelunterschied (${W}×${H} px): ${res.n} Pixel sichtbar anders (${(100 * res.n / res.total).toFixed(1)} %), davon ${res.strong} deutlich (Δ>60), größte Abweichung ${res.mx}/255`);
    if (res.strong < 25) fail('Unterschied am Standbild zu schwach');
    if (L.n === 3 && res.strong > 220) fail('Level 3 zu auffällig');
  }
  await b.close();
  console.log(ok ? 'OK: alle Fairness-Prüfungen bestanden.' : 'NICHT OK.');
  process.exit(ok ? 0 : 1);
})();
