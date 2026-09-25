// TRACE v10 — Kolofon "color lab": klik swatch = salin kode + panel terisi warna itu dari titik klik, teks otomatis kontras.
(function(){var a=document.getElementById('kolofon'),n=document.getElementById('sw-note'),f=a&&a.querySelector('.lab-flood');if(!a||!n||!f)return;
var cur='#08191a';
function L(h){var v=[1,3,5].map(function(i){var c=parseInt(h.substr(i,2),16)/255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function fg(h){var l=L(h);return 1.05/(l+.05)>(l+.05)/(L('#08191a')+.05)?'#fff':'#08191a'}
document.querySelectorAll('.sw').forEach(function(b){b.addEventListener('click',function(e){
 var h=b.dataset.hex,r=a.getBoundingClientRect(),q=b.getBoundingClientRect(),
 x=(e.detail?e.clientX:q.left+q.width/2)-r.left,y=(e.detail?e.clientY:q.top+q.height/2)-r.top,
 ok=function(){n.textContent='Tersalin: '+h},no=function(){n.textContent='Salin manual: '+h};
 a.style.background=cur;f.style.transition='none';f.style.clipPath='circle(0 at '+x+'px '+y+'px)';f.style.background=h;void f.offsetWidth;
 f.style.transition='';f.style.clipPath='circle(150% at '+x+'px '+y+'px)';
 cur=h;var c=fg(h);a.style.setProperty('--fg',c);a.style.setProperty('--note',c);
 try{navigator.clipboard.writeText(h).then(ok,no)}catch(z){no()}})})})();
