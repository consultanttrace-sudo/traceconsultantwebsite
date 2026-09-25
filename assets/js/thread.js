// TRACE Thread v7.7 — signature: "benang jejak" di tepi layar.
// Seluruh halaman jadi satu jalur: benang menegang mengikuti kecepatan scroll, ditarik pointer,
// punya simpul tiap section, dan menutup jadi cincin di Kontak. Judul ikut miring lewat --sk.
(function () {
  if (window.__traceThread) return; window.__traceThread = 1;
  var D = document, R = D.documentElement, RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cv = D.createElement('canvas'), g = cv.getContext && cv.getContext('2d');
  if (!g) return;
  cv.className = 'tc-thread'; cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;top:0;right:0;height:100%;pointer-events:none;z-index:30';
  D.body.appendChild(cv);
  var W, H, dpr, pad, maxL, big, lite, N, off, vel, secs = [], docH = 1, sy = scrollY, v = 0, sk = 0, lt = 0,
      px = -999, py = 0, run = 0, raf = 0, rz = 0, mt = 0, lw = innerWidth, lh = innerHeight,
      t0 = performance.now() + (RM ? 0 : 2100), intro = RM ? 1 : 0;
  var CL = function (a, lo, hi) { return a < lo ? lo : a > hi ? hi : a; };
  var headY = function () { return CL((sy + H * .5) / docH, 0, 1) * H; };

  function measure() {
    var y = scrollY; secs = [];
    D.querySelectorAll('.hero,section[id]').forEach(function (e) {
      var r = e.getBoundingClientRect(); if (r.height < 40) return;
      var h = e.querySelector('h2'), n = e.classList.contains('hero') ? 'Beranda' : (h ? h.textContent : e.id);
      n = n.replace(/\s+/g, ' ').trim(); if (n.length > 24) n = n.slice(0, 23) + '…';
      secs.push({ c: y + r.top + r.height / 2, n: n });
    });
    docH = Math.max(R.scrollHeight, 1);
  }

  function size() {
    lite = R.classList.contains('lite'); big = innerWidth >= 900;
    pad = big ? 24 : 10; maxL = big ? 62 : 20; W = big ? 330 : 34; H = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, lite ? 1 : 1.75);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px';
    N = big && !lite ? 56 : 30; off = new Float32Array(N + 1); vel = new Float32Array(N + 1);
    measure(); kick();
  }

  function step(f) {
    var hy = headY(), sg = H * .17, bx = innerWidth - pad, near = px > innerWidth - 200 && !RM, e = 0;
    for (var i = 0; i <= N; i++) {
      var y = i / N * H, o = off[i], d = (y - hy) / sg, q = (y - py) / (H * .13),
          a = -.09 * o + .34 * ((i ? off[i - 1] : 0) + (i < N ? off[i + 1] : 0) - 2 * o) - v * 1.25 * Math.exp(-d * d);
      if (near) a += .07 * (1 - CL((bx - px) / 200, 0, 1)) * (CL(px - bx, -maxL, 0) - o) * Math.exp(-q * q);
      vel[i] = (vel[i] + a * f) * .86; o = CL(o + vel[i] * f, -maxL, 6); off[i] = o;
      e += Math.abs(vel[i]) + Math.abs(o);
    }
    return e;
  }

  function label(x, y, t) {
    g.font = '600 11.5px Inter,system-ui,sans-serif';
    var w = g.measureText(t).width + 18, x1 = Math.max(4, x - 18 - w);
    g.fillStyle = 'rgba(8,25,26,.88)'; g.beginPath();
    if (g.roundRect) g.roundRect(x1, y - 12, w, 24, 12); else g.rect(x1, y - 12, w, 24);
    g.fill(); g.fillStyle = '#f5f7f6'; g.textBaseline = 'middle'; g.fillText(t, x1 + 9, y + .5);
  }

  function draw(now) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var bx = W - pad, hy = headY(), L = H * (1 - Math.pow(1 - intro, 3)), hh = Math.min(hy, L), i, s, ny, x, on, a = -1;
    var tr = function (to) {
      var m = Math.min(N, Math.floor(to / H * N)); g.beginPath(); g.moveTo(bx + off[0], 0);
      for (var j = 1; j <= m; j++) g.lineTo(bx + off[j], j / N * H);
      if (m < N) g.lineTo(bx + off[m], to);
    };
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.setLineDash([2, 7]); g.strokeStyle = 'rgba(122,150,148,.5)'; g.lineWidth = 1.5; tr(L); g.stroke(); g.setLineDash([]);
    var gr = g.createLinearGradient(0, 0, 0, Math.max(hh, 1)); gr.addColorStop(0, '#17b3a0'); gr.addColorStop(1, '#f5b43c');
    g.strokeStyle = gr; g.lineWidth = big ? 2.6 : 2;
    if (!lite) { g.shadowColor = 'rgba(23,179,160,.6)'; g.shadowBlur = 6 + Math.min(12, Math.abs(v) * 7); }
    tr(hh); g.stroke(); g.shadowBlur = 0;
    for (i = 0; i < secs.length; i++) if (secs[i].c <= sy + H * .5) a = i;
    for (i = 0; i < secs.length; i++) {
      s = secs[i]; ny = s.c / docH * H; if (ny > L) continue;
      x = bx + off[Math.round(ny / H * N)]; on = i <= a;
      g.beginPath(); g.arc(x, ny, i === a ? 5 : 3, 0, 6.283);
      g.fillStyle = on ? '#f5b43c' : 'rgba(245,247,246,.95)'; g.fill();
      g.lineWidth = 1.5; g.strokeStyle = on ? 'rgba(245,180,60,.9)' : '#17b3a0'; g.stroke();
      if (i === a && big && !lite) label(x, ny, s.n);
    }
    var end = a > 0 && a === secs.length - 1, rs = big ? 1 : .6;
    x = bx + off[Math.round(hh / H * N)];
    g.beginPath(); g.arc(x, hh, 4.5 * rs + 1, 0, 6.283); g.fillStyle = '#f5b43c'; g.fill();
    g.beginPath(); g.arc(x, hh, ((end ? 13 + 2.5 * Math.sin(now / 420) : 9) + Math.min(6, Math.abs(v) * 3)) * rs, 0, 6.283);
    g.strokeStyle = 'rgba(245,180,60,' + (end ? .95 : .5) + ')'; g.lineWidth = end ? 2.2 : 1.5; g.stroke();
    return end && !RM;
  }

  function frame(now) {
    if (now < t0) { raf = requestAnimationFrame(frame); lt = now; return; }
    var dt = Math.max(1, Math.min(48, now - lt)), ny = scrollY, dy = ny - sy, e, end;
    lt = now; sy = ny;
    if (!RM) {
      v += (dy / dt - v) * .18;
      var dg = CL(v * 1.4, -3.5, 3.5); if (dg < .05 && dg > -.05) dg = 0;
      if (Math.abs(dg - sk) > .03) { sk = dg; R.style.setProperty('--sk', dg.toFixed(2) + 'deg'); }
    }
    window.__traceV = v;
    if (intro < 1) intro = CL((now - t0) / 1500, 0, 1);
    e = step(Math.min(dt / 16, 1.2)); end = draw(now);
    if (intro < 1 || e > .08 || Math.abs(v) > .01 || end || px > innerWidth - 200) raf = requestAnimationFrame(frame);
    else { run = 0; if (sk) { sk = 0; R.style.setProperty('--sk', '0deg'); } }
  }

  function kick() { if (!run) { run = 1; lt = performance.now(); raf = requestAnimationFrame(frame); } }

  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', function () {
    if (innerWidth === lw && Math.abs(innerHeight - lh) < 140) return;
    lw = innerWidth; lh = innerHeight;
    if (!rz) rz = requestAnimationFrame(function () { rz = 0; size(); });
  });
  addEventListener('load', function () { measure(); kick(); });
  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return; px = e.clientX; py = e.clientY; if (px > innerWidth - 200) kick();
  }, { passive: true });
  R.addEventListener('mouseleave', function () { px = -999; });
  var ro = window.ResizeObserver && new ResizeObserver(function () { clearTimeout(mt); mt = setTimeout(function () { measure(); kick(); }, 150); });
  if (ro) ro.observe(D.body);
  addEventListener('pagehide', function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); cv.remove(); });
  size();
})();
