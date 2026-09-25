// TRACE section gelap — adegan Three.js: printer matte + struk melengkung + debu bokeh, kamera dolly terikat scroll.
// Ada foto assets/img/photo/dark-scene.webp → 3D tidak dipakai. WebGL gagal → adegan CSS v3 tetap tampil.
import*as T from './vendor/three.module.min.js';
const host=document.querySelector('.section-dark'),img=host&&host.querySelector('.dark-photo img');
const boot=()=>{try{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,clamp=v=>Math.max(0,Math.min(1,v));
const cv=document.createElement('canvas');cv.className='dark-gl';cv.setAttribute('aria-hidden','true');
const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
r.setPixelRatio(Math.min(devicePixelRatio,document.documentElement.classList.contains('lite')?1.25:(window.__ph&&innerWidth>=760)?1.5:2));r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.1;
host.prepend(cv);host.classList.add('dg-on');
const sc=new T.Scene(),cam=new T.PerspectiveCamera(34,1,.1,60),g=new T.Group();sc.add(g);
sc.fog=new T.FogExp2(0x08191a,.06); // kabut → kesan depth-of-field
const tx=(w,h,f,s)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(s)t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t};
const glowT=tx(128,128,(c)=>{const q=c.createRadialGradient(64,64,0,64,64,64);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.25,'rgba(255,255,255,.35)');q.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=q;c.fillRect(0,0,128,128)},1);
// printer matte hitam + slot emisif teal
const mat=new T.MeshStandardMaterial({color:0x0b1112,roughness:.5,metalness:.35});
const body=new T.Mesh(new T.BoxGeometry(2.8,1.4,2),mat);body.position.y=.7;
const lid=new T.Mesh(new T.BoxGeometry(2.88,.14,2.08),new T.MeshStandardMaterial({color:0x141f20,roughness:.35,metalness:.5}));lid.position.y=1.47;
const slot=new T.Mesh(new T.BoxGeometry(2.1,.05,.14),new T.MeshBasicMaterial({color:new T.Color(0x17b3a0).multiplyScalar(3),toneMapped:false}));slot.position.set(0,1.55,.15);
const sp=(c,w,h,o,y)=>{const s=new T.Sprite(new T.SpriteMaterial({map:glowT,color:c,blending:T.AdditiveBlending,transparent:true,depthWrite:false,opacity:o,fog:false}));s.scale.set(w,h,1);s.position.set(0,y,.2);return s};
const halo=sp(0x17b3a0,5.6,2.4,.75,1.7),floor=sp(0x17b3a0,7,2,.35,.02);floor.material.rotation=0;
g.add(body,lid,slot,halo,floor);
// struk panjang: pita yang naik dari slot, melengkung & berputar pelan
const rg=new T.PlaneGeometry(.95,1,10,140),P=rg.attributes.position,B=Float32Array.from(P.array);
const map=tx(256,768,(c,w,h)=>{c.fillStyle='#fbfcfb';c.fillRect(0,0,w,h);c.fillStyle='#08191A';c.font='600 20px monospace';c.fillText('STRUK HARIAN',20,60);c.font='500 17px monospace';['Omzet ····· naik','HPP ········ ?','Biaya ······ ?','Profit ····· ?'].forEach((s,i)=>c.fillText(s,20,110+i*36));c.fillStyle='#F5B43C';c.fillRect(20,270,54,4);c.strokeStyle='#9aa6a5';c.setLineDash([6,6]);c.beginPath();c.moveTo(0,700);c.lineTo(w,700);c.stroke()},1);
map.wrapT=T.RepeatWrapping;
const rc=new T.Mesh(rg,new T.MeshStandardMaterial({map,roughness:.85,side:2,emissive:0x0e5a52,emissiveIntensity:.28}));g.add(rc);
const bend=(t,p,small)=>{const L=(small?2:2.6)+p*(small?1.8:2.6);map.repeat.set(1,L/3);
  for(let i=0;i<P.count;i++){const x=B[i*3],s=B[i*3+1]+.5,u=s*L,a=u*.5+Math.sin(t*.4)*.6*s;
    P.setXYZ(i,Math.sin(u*.8+t*.6)*.4*s+x*Math.cos(a),1.56+u*.9+Math.sin(u*7+t)*.02,.15+.9*Math.sin(u*.55-t*.4)*s*s+x*Math.sin(a))}
  P.needsUpdate=true;rg.computeVertexNormals()};
// cahaya: rim teal dari kiri, key hangat kecil (kilau amber), isi lembut
const rim=new T.DirectionalLight(0x17b3a0,2.4);rim.position.set(-5,4,-2);
const amb=new T.PointLight(0xffc880,14,0,2);amb.position.set(2.2,3.2,3.4);
const tl=new T.PointLight(0x17b3a0,28,0,2);tl.position.set(0,2.2,.9);
sc.add(rim,amb,tl,new T.AmbientLight(0x9fd8d0,.32));
// debu / bokeh
const N=140,pp=new Float32Array(N*3);for(let i=0;i<N;i++)pp.set([(Math.random()-.5)*16,Math.random()*8,(Math.random()-.5)*8],i*3);
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pp,3));
const dust=new T.Points(pg,new T.PointsMaterial({map:glowT,size:.22,color:0x9be7dc,transparent:true,opacity:.7,depthWrite:false,blending:T.AdditiveBlending}));g.add(dust);
let small=false,vis=true,pr=0,raf=0;const clk=new T.Clock();
const rs=()=>{const W=host.clientWidth,H=host.clientHeight;small=W<760;r.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();g.scale.setScalar(small?1:.88);g.position.set(small?0:3.75,small?-3.4:-.6,0)};
const draw=()=>{const t=rm?2:clk.getElapsedTime(),b=host.getBoundingClientRect(),vh=innerHeight,p=rm?.55:clamp((vh-b.top)/(vh+b.height));
  pr+=(p-pr)*.1;bend(t,pr,small);
  for(let i=0;i<N;i++){pp[i*3+1]+=.004;if(pp[i*3+1]>8)pp[i*3+1]=0}pg.attributes.position.needsUpdate=true;
  slot.material.color.set(0x17b3a0).multiplyScalar(2.6+Math.sin(t*2)*.4);
  cam.position.set(small?0:-.2+pr*.5,2.4+pr*1.1,small?16-pr*3:11.5-pr*3);cam.lookAt(small?0:1.8,small?1.4:2.4,0);
  r.render(sc,cam)};
const fr=()=>{raf=0;draw();go()},go=()=>{if(!raf&&vis&&!document.hidden&&!rm)raf=requestAnimationFrame(fr)};
new IntersectionObserver(e=>{vis=e[0].isIntersecting;go()},{rootMargin:'120px'}).observe(host);
document.addEventListener('visibilitychange',go);
new ResizeObserver(()=>{rs();draw()}).observe(host);
rs();draw();go();
}catch(e){console.warn('WebGL section gelap off → fallback CSS',e)}};
const init=()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return boot();let d=0,tm;const g=()=>{if(d)return;d=1;removeEventListener('scroll',sc);clearTimeout(tm);boot()},sc=()=>{if(scrollY>innerHeight*.2)g()};
 tm=setTimeout(()=>'requestIdleCallback' in window?requestIdleCallback(g,{timeout:1500}):g(),4500);addEventListener('scroll',sc,{passive:true});sc()};
if(host){if(!img)init();else{img.loading='eager';if(img.complete){if(!img.naturalWidth)init()}else img.addEventListener('error',init)}}
