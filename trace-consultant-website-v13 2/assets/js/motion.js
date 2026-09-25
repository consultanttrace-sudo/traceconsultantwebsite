// TRACE v7.9 — koreografi scroll: section terbuka lewat mask (bukan fade), judul bergeser horizontal mengikuti scroll, foto dapur membuka dari clip, cursor berhirarki (mouse saja).
(function(){
var D=document;if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cl=function(v){return v<0?0:v>1?1:v};
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 var c=D.createElement('div'),x=-99,y=-99,cx=0,cy=0,run=0,on=0;c.className='cur';c.setAttribute('aria-hidden','true');D.body.appendChild(c);
 var lp=function(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;c.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';
  if(Math.abs(x-cx)+Math.abs(y-cy)>.3)requestAnimationFrame(lp);else run=0};
 addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;x=e.clientX;y=e.clientY;
  if(!on){on=1;cx=x;cy=y;c.classList.add('on')}if(!run){run=1;requestAnimationFrame(lp)}},{passive:true});
 D.addEventListener('pointerover',function(e){c.classList.toggle('hot',!!(e.target.closest&&e.target.closest('a,button,summary,[data-k]')))});
 D.documentElement.addEventListener('mouseleave',function(){c.classList.remove('on');on=0});
}
var S=[].slice.call(D.querySelectorAll('.v6s,.stats,.gallery')),K=D.querySelector('.kitchen'),Hs=[].slice.call(D.querySelectorAll('.gallery-heading')),vis=new Set(),tk=0;
S.forEach(function(s){s.classList.add('wp')});
var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)});kick()},{rootMargin:'25% 0px'});
S.concat(K?[K]:[],Hs).forEach(function(n){io.observe(n)});
function upd(){tk=0;var h=innerHeight;vis.forEach(function(n){var r=n.getBoundingClientRect();
 if(n===K)n.style.setProperty('--k',cl((h-r.top)/(h*.8)).toFixed(3));
 else if(n.classList.contains('wp'))n.style.setProperty('--e',cl((h-r.top)/(h*.5)).toFixed(3));
 else n.style.setProperty('--hx',(((r.top+r.height/2)/h-.5)*-9).toFixed(2)+'vw')})}
function kick(){if(!tk)tk=requestAnimationFrame(upd)}
addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick);
})();
