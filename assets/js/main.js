// TRACE Consultant — site interactions
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Scroll reveals (single calm mechanism reused everywhere) ---- */
  const revealTargets = document.querySelectorAll('[data-reveal], .fan, .stats');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Stats: animate knobs from resting position to their data-target value
        if (entry.target.classList.contains('stats')) {
          entry.target.querySelectorAll('.knob').forEach(knob => {
            const target = knob.getAttribute('data-target');
            if (target) requestAnimationFrame(() => { knob.style.left = target; });
          });
        }
        if (entry.target.classList.contains('stats')) {
          entry.target.querySelectorAll('[data-count]').forEach(el => {
            const end = +el.dataset.count, t0 = performance.now(), d = 1400;
            const tick = t => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
          });
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  revealTargets.forEach(el => io.observe(el));

  /* ---- Mobile nav menu ---- */
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menuPanel = document.querySelector('[data-menu-panel]');
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', () => {
      const open = menuPanel.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menuPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuPanel.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---- Contact form: Supabase bila terisi, cadangan WhatsApp bila belum/gagal (v7) ---- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const statusEl = form.querySelector('.form-status');
    const num = (window.TRACE_CONFIG && window.TRACE_CONFIG.whatsapp) || '62895428298682';
    const say = (tone, text, href) => {
      statusEl.dataset.tone = tone; statusEl.textContent = text;
      if (href) { const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Kirim lewat WhatsApp'; statusEl.append(' ', a); }
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const kb = form.kebutuhan && form.kebutuhan.value ? form.kebutuhan.value : '', msg = form.message.value.trim();
      const data = { name: form.name.value.trim(), contact: form.contact.value.trim(), message: (kb ? '[Kebutuhan: ' + kb + '] ' : '') + msg };
      if (!data.name || !data.contact) { say('err', 'Isi nama dan kontak dulu, ya.'); return; }
      const wa = 'https://wa.me/' + num + '?text=' + encodeURIComponent('Halo TRACE, saya ' + data.name + ' (' + data.contact + '). Saya mau booking diagnosis awal.' + (kb ? ' Kebutuhan: ' + kb + '.' : '') + (msg ? ' ' + msg : ''));
      if (!window.traceSupabase) { window.open(wa, '_blank', 'noopener'); say('ok', 'Membuka WhatsApp dengan pesanmu, tinggal tekan kirim. Belum terbuka?', wa); return; }
      btn.disabled = true; say('', 'Mengirim...');
      const { error } = await window.traceSupabase.from('leads').insert([data]);
      btn.disabled = false;
      if (error) { console.error(error); say('err', 'Belum terkirim. Pesanmu bisa langsung dikirim lewat WhatsApp.', wa); }
      else { say('ok', 'Diterima. Tim TRACE akan menghubungi kamu dalam 1x24 jam.'); form.reset(); }
    });
  }

  /* ---- v4: kipas terikat scroll, kilau pointer, section gelap ---- */
  const fan = document.querySelector('.fan'), dark = document.querySelector('.section-dark'), dph = document.querySelector('.dark-photo img');
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches, clamp = (v) => Math.max(0, Math.min(1, v));
  let tick = 0;
  const onScroll = () => { tick = 0;
    const vh = innerHeight; document.documentElement.style.setProperty('--sp', (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
    if (fan && !rm) { const r = fan.getBoundingClientRect(); const fp = clamp((vh * .85 - r.top) / (vh * .55)); fan.style.setProperty('--p', fp.toFixed(3)); fan.classList.toggle('is-open', fp > .9); }
    if (dark && dph && !rm) { const r = dark.getBoundingClientRect(); dark.style.setProperty('--dy', ((r.top + r.height / 2 - vh / 2) * -.06).toFixed(1) + 'px'); }
  };
  addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(onScroll); }, { passive: true });
  addEventListener('resize', onScroll); onScroll();
  if (dark) new IntersectionObserver(([e]) => dark.classList.toggle('is-in', e.intersectionRatio > .4), { threshold: [0, .4, .8] }).observe(dark);
  document.querySelectorAll('.fan-card').forEach(c => {
    c.addEventListener('pointermove', e => { const b = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - b.left) + 'px'); c.style.setProperty('--my', (e.clientY - b.top) + 'px'); c.style.setProperty('--sp', 1); });
    c.addEventListener('pointerleave', () => c.style.setProperty('--sp', 0));
  });
  /* v5.1: HP — ketuk kartu kipas untuk membawanya ke depan */
  if (fan) fan.querySelectorAll('.fan-card').forEach(c => c.addEventListener('click', () => {
    if (innerWidth > 760) return;
    const on = !c.classList.contains('is-front');
    fan.querySelectorAll('.fan-card').forEach(x => x.classList.remove('is-front'));
    c.classList.toggle('is-front', on); fan.classList.toggle('has-front', on);
  }));
  /* v7.6: judul naik per kata dari balik topeng; grain film di band gelap dan hero; getar halus saat ketuk (Android) */
  const split = (el) => { let i = 0; const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) { f.append(t); return; } const w = document.createElement('span'), s = document.createElement('span'); w.className = 'wd'; s.style.setProperty('--i', i++); s.textContent = t; w.append(s); f.append(w); }); c.replaceWith(f); }
    else if (c.nodeType === 1) walk(c); }); walk(el); el.classList.add('is-split'); };
  if (!rm) document.querySelectorAll('.heading-hero,.gallery-heading').forEach(split);
  if (!document.documentElement.classList.contains('lite')) document.querySelectorAll('.hero,.section-dark,.v6-dark').forEach(s => { const g = document.createElement('i'); g.className = 'grain'; g.setAttribute('aria-hidden', 'true'); s.appendChild(g); });
  document.addEventListener('click', e => { if (navigator.vibrate && e.target.closest('.btn-primary,.btn-outline,.lens-btns button,.fan-card')) navigator.vibrate(8); });
  /* v7.5: cahaya mengikuti pointer di band gelap; tombol utama menarik sedikit ke pointer (mouse saja) */
  document.querySelectorAll('.v6-dark').forEach(s => s.addEventListener('pointermove', e => { const b = s.getBoundingClientRect(); s.style.setProperty('--gx', ((e.clientX - b.left) / b.width * 100).toFixed(1) + '%'); s.style.setProperty('--gy', ((e.clientY - b.top) / b.height * 100).toFixed(1) + '%'); }, { passive: true }));
  if (!rm && matchMedia('(hover:hover) and (pointer:fine)').matches) document.querySelectorAll('.btn-primary').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px'; });
    b.addEventListener('pointerleave', () => { b.style.translate = '0 0'; });
  });
  /* v7: kursor lensa — cincin teal yang menyusul mouse, membesar dan jadi amber di atas elemen yang bisa diketuk (hanya mouse) */
  if (!rm && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const L = document.createElement('div'); L.className = 'lens'; L.setAttribute('aria-hidden', 'true'); document.body.appendChild(L);
    let x = -100, y = -100, lx = x, ly = y, on = false;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!on) { on = true; lx = x; ly = y; L.classList.add('is-on'); } L.classList.toggle('is-hot', !!e.target.closest('a,button,summary,input,textarea,select,.fan-card')); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { on = false; L.classList.remove('is-on'); });
    const loop = () => { lx += (x - lx) * .18; ly += (y - ly) * .18; L.style.transform = 'translate3d(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px,0) translate(-50%,-50%)'; requestAnimationFrame(loop); };
    loop();
  }
  /* v7 lomba: kartu paket miring 3D mengikuti pointer (hanya mouse, bukan reduced-motion) */
  if (!rm && matchMedia('(hover:hover) and (pointer:fine)').matches) document.querySelectorAll('.price-card').forEach(c => {
    c.addEventListener('pointermove', e => { const b = c.getBoundingClientRect(); c.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 9 + 'deg'); c.style.setProperty('--rx', (.5 - (e.clientY - b.top) / b.height) * 7 + 'deg'); });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });
});
