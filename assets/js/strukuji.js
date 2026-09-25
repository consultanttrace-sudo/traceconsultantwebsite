/* v11 — Struk Uji: kalkulator HPP langsung di peramban (tanpa server, tanpa dependensi) */
(function () {
  var f = document.getElementById('su-form'), root = document.querySelector('.su');
  if (!f || !root) return;
  var $ = function (i) { return document.getElementById(i); };
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  var dirty = false, shown = {}, sayT;
  function num(s) { return Math.min(parseInt(String(s).replace(/\D/g, ''), 10) || 0, 999999999); }
  function rp(v) { v = Math.round(v); return (v < 0 ? '\u2212' : '') + 'Rp ' + nf.format(Math.abs(v)); }
  function pc(v) { return (v < 0 ? '\u2212' : '') + Math.abs(v) + '%'; }
  function fmtInput(el) {
    var before = el.value.slice(0, el.selectionStart || 0).replace(/\D/g, '').length, v = num(el.value);
    el.value = v ? nf.format(v) : '';
    var i = 0, d = 0; while (i < el.value.length && d < before) { if (/\d/.test(el.value[i])) d++; i++; }
    try { el.setSelectionRange(i, i); } catch (e) {}
  }
  function put(id, val, fmt) {
    var el = $(id), from = shown[id]; if (!el) return; shown[id] = val;
    if (rm || from == null || from === val) { el.textContent = fmt(val); return; }
    var t0 = performance.now(); cancelAnimationFrame(el._r);
    (function step(t) {
      var k = Math.min(1, (t - t0) / 380); k = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (val - from) * k);
      if (k < 1) el._r = requestAnimationFrame(step);
    })(t0);
  }
  function calc() {
    var J = num($('su-jual').value), B0 = num($('su-bahan').value), O = num($('su-ops').value),
        N = num($('su-porsi').value), up = +$('su-naik').value;
    var B = B0 * (1 + up / 100), S = J - B - O, day = S * N, mon = day * 30, ok = J > 0;
    $('su-naik-v').textContent = up ? '+' + up + '%' : '0%';
    $('t-b').textContent = up ? 'Bahan (+' + up + '%)' : 'Bahan';
    put('o-j', J, rp); put('o-b', B, rp); put('o-o', O, rp); put('o-s', S, rp);
    put('o-d', day, rp); put('o-m', mon, rp); put('su-big', mon, rp);
    var hr = ok ? Math.round(B / J * 100) : 0, or = ok ? Math.round(O / J * 100) : 0,
        sr = !ok ? 0 : S >= 0 ? Math.max(0, 100 - hr - or) : Math.round(S / J * 100);
    $('o-h').textContent = ok ? hr + '%' : '-';
    $('k-b').textContent = ok ? hr + '%' : '-'; $('k-o').textContent = ok ? or + '%' : '-'; $('k-s').textContent = ok ? pc(sr) : '-';
    var tot = B + O, bw = 0, ow = 0, sw = 0;
    if (ok) { if (tot > J) { bw = B / tot * 100; ow = 100 - bw; } else { bw = B / J * 100; ow = O / J * 100; sw = 100 - bw - ow; } }
    root.querySelector('.s-b').style.width = bw + '%'; root.querySelector('.s-o').style.width = ow + '%'; root.querySelector('.s-s').style.width = sw + '%';
    root.classList.toggle('is-neg', ok && S < 0);
    var msg = !ok ? 'Isi harga jual dulu supaya struknya bisa dihitung.' :
      'Dari tiap Rp100 yang masuk, Rp' + hr + ' habis untuk bahan dan Rp' + or + ' untuk operasional. ' +
      (S >= 0 ? 'Yang tersisa Rp' + sr + '.' : 'Kamu nombok Rp' + Math.abs(sr) + ' untuk tiap Rp100 penjualan.') +
      (up ? ' Kenaikan bahan ' + up + '% menambah biaya ' + rp((B - B0) * N * 30) + ' per bulan.' : '');
    clearTimeout(sayT); sayT = setTimeout(function () { $('su-say').textContent = msg; }, dirty ? 600 : 0);
    var num_ = (window.TRACE_CONFIG && window.TRACE_CONFIG.whatsapp) || '62895428298682';
    var txt = dirty && ok ?
      'Halo TRACE, saya coba Struk Uji di website. Harga jual ' + rp(J) + ', bahan ' + rp(B0) + ', operasional ' + rp(O) + ' per porsi, ' + N + ' porsi per hari' +
      (up ? ', bahan naik ' + up + '%' : '') + '. Hitungan kasar: HPP ' + hr + '%, sisa ' + rp(mon) + ' per bulan (30 hari buka). Saya mau bahas diagnosis lengkapnya.' :
      'Halo TRACE, saya mau booking diagnosis awal';
    $('su-wa').href = 'https://wa.me/' + num_ + '?text=' + encodeURIComponent(txt);
  }
  f.addEventListener('input', function (e) { if (e.target.matches('[data-n]')) fmtInput(e.target); dirty = true; calc(); });
  f.addEventListener('focusin', function (e) { if (e.target.matches('[data-n]')) setTimeout(function () { e.target.select(); }, 0); });
  f.addEventListener('submit', function (e) { e.preventDefault(); });
  calc();
})();
