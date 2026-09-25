(function () {
  var C = window.TRACE_PAKET; if (!C) return;
  var lens = document.querySelector('[data-lens]');
  if (lens) {
    var out = lens.querySelector('.lens-out');
    var show = function (k) {
      var d = C.lensa[k];
      lens.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === k); });
      lens.querySelectorAll('.lens-dia g').forEach(function (g) { g.classList.toggle('on', g.dataset.k === k); });
      out.innerHTML = '<b>' + d[0] + '</b><span>Layanan terkait: ' + d[1] + '</span><em>' + d[2] + '</em>';
      var gl = lens.querySelector('.lens-glass'), pc = lens.querySelector('.lens-dia g[data-k="' + k + '"] circle');
      if (gl && pc) gl.style.transform = 'translate(' + pc.getAttribute('cx') + 'px,' + pc.getAttribute('cy') + 'px)';
    };
    lens.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.k); }); });
    lens.querySelectorAll('.lens-dia g').forEach(function (g) { g.addEventListener('click', function () { show(g.dataset.k); }); });
    var dia = lens.querySelector('.lens-dia');
    if (dia && !matchMedia('(prefers-reduced-motion:reduce)').matches && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      dia.addEventListener('pointermove', function (e) { var b = dia.getBoundingClientRect(); dia.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 16 + 'deg'); dia.style.setProperty('--rx', (.5 - (e.clientY - b.top) / b.height) * 12 + 'deg'); });
      dia.addEventListener('pointerleave', function () { dia.style.setProperty('--rx', '0deg'); dia.style.setProperty('--ry', '0deg'); });
    }
    show('T');
  }
  var m = document.querySelector('[data-matrix]');
  if (m) {
    var mark = { penuh: '<i class="mx-ok" aria-label="termasuk">✓</i>', dasar: '<i class="mx-basic">dasar</i>', '': '<i class="mx-no">tidak</i>' };
    m.innerHTML = '<tr><th scope="col">Layanan</th><th scope="col">Paket 1</th><th scope="col">Paket 2</th><th scope="col">Paket 3</th></tr>' +
      C.layanan.map(function (l) { return '<tr' + (l.t ? ' class="mx-t"' : '') + '><th scope="row">' + l.n + '</th>' + (l.t || l.p).map(function (v) { return '<td>' + (l.t ? v : mark[v]) + '</td>'; }).join('') + '</tr>'; }).join('');
  }  var k = new URLSearchParams(location.search).get('kebutuhan'), sel = document.querySelector('[name=kebutuhan]');
  if (k && sel) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text.toLowerCase() === k.toLowerCase()) sel.selectedIndex = i;
})();

(function () {
  var C = window.TRACE_PAKET, nk = document.querySelector('[data-konfirmasi]');
  if (nk && !(C && C.perluKonfirmasi && /[?&]draf=1/.test(location.search))) nk.remove();
  var r = document.querySelector('[data-rhythm]');
  if (r) {
    var o = r.querySelector('.rh-out'), bs = r.querySelectorAll('button');
    bs.forEach(function (b, i) {
      b.setAttribute('aria-pressed', i === 0);
      b.addEventListener('click', function () {
        bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        o.innerHTML = '<b></b><span></span>'; o.firstChild.textContent = b.dataset.h; o.lastChild.textContent = b.dataset.d;
      });
    });
  }
  document.querySelectorAll('[data-ba] .ba-r').forEach(function (i) {
    var s = i.closest('[data-ba]'), f = function () { s.style.setProperty('--x', i.value + '%'); };
    i.addEventListener('input', f); f();
  });
  var bt = document.querySelector('[data-blogt]');
  if (bt && window.traceBlog && window.traceSupabase) {
    window.traceBlog.listPosts().then(function (res) {
      var d = res && res.data; if (!d || !d.length) return;
      var l = bt.querySelector('.blogt-list');
      d.slice(0, 3).forEach(function (p) {
        var a = document.createElement('a'), b = document.createElement('b'), s = document.createElement('span');
        a.href = 'blog-post.html?slug=' + encodeURIComponent(p.slug); b.textContent = p.title; s.textContent = p.excerpt || '';
        a.appendChild(b); a.appendChild(s); l.appendChild(a);
      });
      bt.hidden = false;
    }).catch(function () {});
  }
})();

/* v7: detail layanan jadi accordion, satu terbuka */
(function () {
  var items = document.querySelectorAll('#detail-layanan .svc'); if (!items.length) return;
  var set = function (it, on) { it.classList.toggle('is-open', on); it.querySelector('.svc-hd button').setAttribute('aria-expanded', on ? 'true' : 'false'); it.querySelector('.svc-b').hidden = !on; };
  var only = function (it) { items.forEach(function (x) { set(x, x === it); }); };
  items.forEach(function (it, i) {
    var h = it.querySelector('h3'), hd = document.createElement('h3'), bt = document.createElement('button'), b = document.createElement('div');
    hd.className = 'svc-hd'; bt.type = 'button'; b.className = 'svc-b'; b.id = 'svc-b' + i; bt.setAttribute('aria-controls', b.id);
    while (h.firstChild) bt.appendChild(h.firstChild);
    hd.appendChild(bt); h.remove();
    while (it.firstChild) b.appendChild(it.firstChild);
    it.appendChild(hd); it.appendChild(b);
    bt.addEventListener('click', function () { if (it.classList.contains('is-open')) set(it, false); else only(it); });
  });
  only(items[0]);
  var fromHash = function () { var el = location.hash.length > 1 && document.getElementById(location.hash.slice(1)); if (el && el.classList.contains('svc')) { only(el); el.scrollIntoView(); } };
  addEventListener('hashchange', fromHash); fromHash();
})();
