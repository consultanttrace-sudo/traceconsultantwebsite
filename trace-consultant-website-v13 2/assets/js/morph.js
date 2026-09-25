// Penutup: partikel 2D menyusun logo TC (dari berantakan jadi satu bentuk). Mengikuti pointer; reduced-motion = statis.
(()=>{const cv=document.querySelector('.tc-morph');if(!cv)return;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,c=cv.getContext('2d'),im=new Image(),ease=k=>k*k*(3-2*k),cl=k=>Math.max(0,Math.min(1,k));
let W=0,H=0,P=[],t0=0,raf=0,seen=false,vis=false,mx=-999,my=-999;
const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)};
const build=()=>{const s=innerWidth<760?110:150,st=innerWidth<760?3:2,ow=s,oh=Math.round(s*im.height/im.width),o=document.createElement('canvas');o.width=ow;o.height=oh;
 const q=o.getContext('2d');q.drawImage(im,0,0,ow,oh);const D=q.getImageData(0,0,ow,oh).data,k=Math.min(H*.86/oh,W*.5/ow);P=[];
 for(let y=0;y<oh;y+=st)for(let x=0;x<ow;x+=st)if(D[(y*ow+x)*4+3]>140)P.push({tx:(x-ow/2)*k,ty:(y-oh/2)*k,sx:Math.random()*W,sy:Math.random()*H,d:Math.random(),a:Math.random()<.12,r:Math.random()*6.28})};
const draw=n=>{const p=rm?1:cl((n-t0)/2600);c.clearRect(0,0,W,H);
 for(const am of[false,true]){c.fillStyle=am?'#F5B43C':'#0E7C72';
  for(const q of P){if(q.a!==am)continue;const e=ease(cl((p-q.d*.45)/.55));
   let x=q.sx+(W/2+q.tx-q.sx)*e+Math.sin(n*.002+q.r)*(1-e)*14+Math.sin(n*.0015+q.r)*.6*e,y=q.sy+(H/2+q.ty-q.sy)*e+Math.cos(n*.0017+q.r)*(1-e)*14;
   const dx=x-mx,dy=y-my,dd=Math.hypot(dx,dy)+.01;if(dd<70){const f=(70-dd)/70*22;x+=dx/dd*f;y+=dy/dd*f}
   c.fillRect(x,y,2.2,2.2)}}};
const fr=n=>{raf=0;draw(n);if(vis&&!rm)raf=requestAnimationFrame(fr)};
im.onload=()=>{size();build();
 new ResizeObserver(()=>{size();build();if(seen||rm)draw(performance.now())}).observe(cv);
 new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!seen){seen=true;t0=performance.now()}if(rm){draw(0)}else if(vis&&!raf)raf=requestAnimationFrame(fr)},{threshold:.35}).observe(cv)};
im.onerror=()=>cv.remove();
cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top});
cv.addEventListener('pointerleave',()=>{mx=my=-999});
im.src=cv.dataset.src;
})();
