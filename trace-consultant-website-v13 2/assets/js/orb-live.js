// TRACE v7.9 — orb pendamping: melanjutkan orb hero sepanjang halaman. Warna teal→amber mengikuti posisi scroll, distorsi mengikuti kecepatan (window.__traceV), membesar di outro. Mati di lite / reduced-motion.
import*as T from './vendor/three.module.min.js';
const H=document.documentElement;
if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&!H.classList.contains('lite')&&innerWidth>=760&&!window.__ph)(fn=>{let d=0;const g=()=>{if(d||scrollY<innerHeight*.35)return;d=1;removeEventListener('scroll',g);fn()};addEventListener('scroll',g,{passive:true});g()})(()=>{try{
const cv=document.createElement('canvas');cv.className='orb-live';cv.setAttribute('aria-hidden','true');
const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,20);cam.position.z=5.4;
const U={t:{value:0},v:{value:0},m:{value:0}};
const o=new T.Mesh(new T.IcosahedronGeometry(1,innerWidth<760?12:24),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:U,
vertexShader:`uniform float t,v;varying vec3 n,vp;void main(){vec3 p=position;float d=sin(p.x*2.1+t)*sin(p.y*2.3-t*.8)*sin(p.z*1.9+t*.6);p+=normal*d*(.1+v*.28);n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(p,1.);vp=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
fragmentShader:`uniform float m;varying vec3 n,vp;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(vp))),2.);vec3 c=mix(vec3(.09,.7,.63),vec3(.96,.71,.24),m);gl_FragColor=vec4(c*(.35+f*1.4),.18+f*.8);}`}));
sc.add(o);document.body.appendChild(cv);
const clk=new T.Clock();let raf=0,sv=0,sp=0,op=-1;
const rs=()=>{const w=cv.clientWidth;if(w)r.setSize(w,w,false)};
const fr=()=>{raf=0;const y=scrollY,sh=Math.min(1,Math.max(0,(y-innerHeight*.9)/(innerHeight*.5)));
 if(sh!==op){op=sh;cv.style.opacity=sh.toFixed(2)}if(sh<.01)return;
 sv+=(Math.min(3,Math.abs(window.__traceV||0))-sv)*.1;sp+=.006+sv*.04;
 const pg=Math.min(1,y/Math.max(1,H.scrollHeight-innerHeight));
 U.t.value=clk.getElapsedTime();U.v.value=sv;U.m.value=pg;o.rotation.set(sp*.7,sp,0);o.scale.setScalar(1+Math.max(0,pg-.9)*2.5+sv*.05);
 r.render(sc,cam);raf=requestAnimationFrame(fr)};
const go=()=>{if(!raf&&!document.hidden)raf=requestAnimationFrame(fr)};
addEventListener('scroll',go,{passive:true});document.addEventListener('visibilitychange',go);addEventListener('resize',rs);rs();go();
}catch(e){console.warn('Orb pendamping off',e)}});
