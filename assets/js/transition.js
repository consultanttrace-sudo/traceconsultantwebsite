// TRACE — transisi displacement hero → Metode. Foto struk larut lewat noise (RGB-split + tepi amber), progres = scroll, kecepatan = window.__traceV.
// Lite / reduced-motion / WebGL gagal → foto statis + fade CSS (var --p).
import*as T from './vendor/three.module.min.js';
const s=document.querySelector('.tx');
if(s){
const st=s.querySelector('.tx-stick'),H=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const P=()=>Math.min(1,Math.max(0,-s.getBoundingClientRect().top/Math.max(1,s.offsetHeight-innerHeight)));
if(!rm){const css=()=>s.style.setProperty('--p',P().toFixed(3));addEventListener('scroll',css,{passive:true});css()}
const later=(fn,el,ah)=>{let d=0,io;const g=()=>{if(d)return;d=1;io&&io.disconnect();fn()};if(!('IntersectionObserver' in window))return g();io=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting))g()},{rootMargin:ah+' 0px'});io.observe(el)};
if(!rm&&!H.classList.contains('lite'))later(()=>{try{
const cv=document.createElement('canvas');cv.className='tx-gl';cv.setAttribute('aria-hidden','true');
const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:false});r.setPixelRatio(Math.min(devicePixelRatio,1.5));
const U={tx:{value:null},p:{value:0},t:{value:0},v:{value:0},A:{value:1.5}};
const sc=new T.Scene(),cam=new T.Camera();
sc.add(new T.Mesh(new T.PlaneGeometry(2,2),new T.ShaderMaterial({transparent:true,uniforms:U,
vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=vec4(position.xy,0.,1.);}',
fragmentShader:`uniform sampler2D tx;uniform float p,t,v,A;varying vec2 u;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 c=u-.5;if(A>1.5)c.y*=1.5/A;else c.x*=A/1.5;c/=1.+p*.1;c+=.5;
 float z=n(u*vec2(3.,5.)+t*.05)*.7+n(u*9.-t*.04)*.3;
 float k=smoothstep(0.,.9,p);
 vec2 o=(vec2(n(u*4.+3.),n(u*4.+9.))-.5)*.32*k+vec2(0.,v*.006);
 vec3 col=vec3(texture2D(tx,c+o*1.25).r,texture2D(tx,c+o).g,texture2D(tx,c+o*.75).b);
 float val=z*.8+(1.-u.y)*.2,e=p*1.75-.2;
 float al=smoothstep(e-.015,e+.015,val);
 float g=smoothstep(.1,0.,abs(val-e))*step(.001,p)*step(p,.999);
 col=mix(col,vec3(.96,.71,.24),g*.55)+vec3(.09,.7,.63)*g*.25;
 gl_FragColor=vec4(col,al);}`})));
const rs=()=>{const W=st.clientWidth,Hh=st.clientHeight;if(!W||!Hh)return;r.setSize(W,Hh,false);U.A.value=W/Hh};
let vis=false,raf=0,sv=0;const clk=new T.Clock();
const fr=()=>{raf=0;if(!vis)return;sv+=(Math.min(3,Math.abs(window.__traceV||0))-sv)*.1;
 U.p.value=P();U.t.value=clk.getElapsedTime();U.v.value=sv;r.render(sc,cam);raf=requestAnimationFrame(fr)};
new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(fr)}).observe(s);
new ResizeObserver(rs).observe(st);
new T.TextureLoader().load(s.dataset.src,t=>{U.tx.value=t;st.appendChild(cv);s.classList.add('tx-on');rs()},undefined,()=>{});
}catch(e){console.warn('Transisi WebGL off → foto statis',e)}},s,'150%');
}
