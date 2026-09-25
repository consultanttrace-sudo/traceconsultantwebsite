// TRACE hero — WebGL: orb kaca + struk + kartu diagnosis. Gagal/WebGL mati → visual CSS v3 tetap tampil.
import*as T from './vendor/three.module.min.js';
const host=document.querySelector('.hero'),H=document.documentElement;
if(host)try{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const cv=document.createElement('canvas');cv.className='hero-gl';cv.setAttribute('aria-hidden','true');
const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
const LT=H.classList.contains('lite');r.setPixelRatio(Math.min(devicePixelRatio,LT?1.25:(window.__ph&&innerWidth>=760)?1.5:2));r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
host.prepend(cv);H.classList.add('gl-on');
const sc=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,50),g=new T.Group();sc.add(g);
// environment procedural: softbox emisif → PMREM
const en=new T.Scene();en.background=new T.Color(0x0b2a2b);
[[10,6,0,8,4,0xfff1dd,6],[4,10,-9,0,2,0x17b3a0,5],[3,8,9,1,-3,0x6a8dff,3],[12,3,0,-8,0,0xd5efe9,2]].forEach(([w,h,x,y,z,c,i])=>{
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i),side:2}));m.position.set(x,y,z);m.lookAt(0,0,0);en.add(m)});
sc.environment=new T.PMREMGenerator(r).fromScene(en,.03).texture;
const key=new T.DirectionalLight(0xffe2b8,2);key.position.set(3,4,5);
const rim=new T.PointLight(0x17b3a0,40,0,2);rim.position.set(-4,1,-2);
sc.add(key,rim,new T.AmbientLight(0xffffff,.3));
const tx=(w,h,f,s)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(s)t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t};
// kaca: alpha berbasis fresnel agar tetap tembus pandang di canvas transparan (transmission → putih pekat pada alpha:true)
const glass=(o,base)=>{const m=new T.MeshPhysicalMaterial({...o,transparent:true,depthWrite:false,side:2});m.onBeforeCompile=q=>{q.fragmentShader=q.fragmentShader.replace('#include <opaque_fragment>','float fr=pow(1.-abs(dot(normalize(vNormal),normalize(vViewPosition))),2.2);diffuseColor.a=clamp('+base+'+fr*1.2,0.,1.);\n#include <opaque_fragment>')};return m};
// orb kaca + inti teal (agar refraksi punya sesuatu untuk dibelokkan)
const orb=new T.Group();
orb.add(new T.Mesh(new T.SphereGeometry(1.5,64,64),glass({ior:1.4,roughness:.04,iridescence:1,iridescenceIOR:1.4,iridescenceThicknessRange:[250,800],clearcoat:1,clearcoatRoughness:0,envMapIntensity:2.4,color:0xffffff},'.06')));
const core=new T.Sprite(new T.SpriteMaterial({map:tx(256,256,(c)=>{const q=c.createRadialGradient(128,128,0,128,128,128);q.addColorStop(0,'rgba(23,179,160,.55)');q.addColorStop(.45,'rgba(23,179,160,.22)');q.addColorStop(1,'rgba(23,179,160,0)');c.fillStyle=q;c.fillRect(0,0,256,256)},1),transparent:true,depthWrite:false,toneMapped:false}));core.scale.setScalar(2.6);core.position.set(.25,-.15,-.3);orb.add(core);
g.add(orb);
// contact shadow
const sh=new T.Mesh(new T.PlaneGeometry(3.2,.9),new T.MeshBasicMaterial({map:tx(128,64,(c)=>{const q=c.createRadialGradient(64,32,0,64,32,60);q.addColorStop(0,'rgba(8,25,26,.35)');q.addColorStop(1,'rgba(8,25,26,0)');c.fillStyle=q;c.fillRect(0,0,128,64)},1),transparent:true,depthWrite:false}));
sh.position.set(0,-1.68,0);sh.rotation.x=-Math.PI/2;g.add(sh);
// struk 3D
const U={uD:{value:0}};
const rg=new T.PlaneGeometry(1,3,24,96),p=rg.attributes.position;
for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,.28*Math.sin(y*1.3)+.1*Math.sin(y*5+x*3)+x*x*.5)}
rg.computeVertexNormals();
const rc=new T.Mesh(rg,new T.MeshStandardMaterial({map:tx(256,768,(c,w,h)=>{c.fillStyle='#fbfcfb';c.fillRect(0,0,w,h);c.fillStyle='#08191A';c.font='600 22px monospace';c.fillText('STRUK HARIAN',24,70);c.font='500 19px monospace';['Omzet ····· naik','HPP ········ ?','Biaya ······ ?','Profit ····· ?'].forEach((s,i)=>c.fillText(s,24,130+i*40));c.fillStyle='#F5B43C';c.fillRect(24,320,60,4)},1),alphaMap:tx(64,192,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.beginPath();c.moveTo(0,0);c.lineTo(w,0);c.lineTo(w,h-10);for(let i=8;i>=0;i--)c.lineTo(i*8,h-(i%2?0:10));c.fill()}),alphaTest:.5,roughness:.9,side:2}));
rc.scale.setScalar(1.05);{const m=rc.material;m.emissiveMap=m.map;m.emissive.set(0xffffff);m.emissiveIntensity=.6;m.envMapIntensity=.35;m.toneMapped=false;
m.onBeforeCompile=q=>{q.uniforms.uD=U.uD;
  q.vertexShader=q.vertexShader.replace('#include <common>','varying vec2 vQ;\n#include <common>').replace('#include <begin_vertex>','#include <begin_vertex>\nvQ=uv;');
  q.fragmentShader=q.fragmentShader.replace('#include <common>','varying vec2 vQ;uniform float uD;\nfloat h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}\n#include <common>')
   .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat nz=vn(vQ*vec2(5.,14.))*.75+vQ.y*.25,ed=uD*1.25-.1;if(uD>.001&&nz<ed)discard;totalEmissiveRadiance+=vec3(1.,.62,.15)*smoothstep(.09,0.,nz-ed)*step(.001,uD)*4.;')}}g.add(rc);
// kartu kaca "Diagnosis"
const w=1.5,h=2.1,R=.14,x=-w/2,y=-h/2,s=new T.Shape();
s.moveTo(x+R,y);s.lineTo(x+w-R,y);s.quadraticCurveTo(x+w,y,x+w,y+R);s.lineTo(x+w,y+h-R);s.quadraticCurveTo(x+w,y+h,x+w-R,y+h);s.lineTo(x+R,y+h);s.quadraticCurveTo(x,y+h,x,y+h-R);s.lineTo(x,y+R);s.quadraticCurveTo(x,y,x+R,y);
const cg=new T.ExtrudeGeometry(s,{depth:.06,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:3,curveSegments:10});cg.center();
const cd=new T.Mesh(cg,glass({ior:1.45,roughness:.05,clearcoat:1,envMapIntensity:2.2,color:0xffffff},'.1'));
const ch=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tx(256,360,(c)=>{[.45,.7,.55,.85].forEach((v,i)=>{c.fillStyle=i==3?'#F5B43C':'#0E7C72';c.beginPath();c.roundRect(34+i*46,300-v*190,30,v*190,6);c.fill()});c.fillStyle='#08191A';c.font='600 22px sans-serif';c.fillText('Diagnosis',30,52)},1),transparent:true,toneMapped:false}));
ch.position.z=.09;cd.add(ch);
const sn=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tx(128,180,(c,W,Hh)=>{c.beginPath();c.roundRect(2,2,W-4,Hh-4,11);c.clip();const q=c.createLinearGradient(0,0,W,Hh);q.addColorStop(0,'rgba(255,255,255,.55)');q.addColorStop(.32,'rgba(255,255,255,.08)');q.addColorStop(.36,'rgba(255,255,255,.3)');q.addColorStop(.5,'rgba(255,255,255,0)');c.fillStyle=q;c.fillRect(0,0,W,Hh);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;c.beginPath();c.roundRect(2,2,W-4,Hh-4,11);c.stroke()},1),transparent:true,depthWrite:false,toneMapped:false}));sn.position.z=.1;cd.add(sn);g.add(cd);
// kontur buku besar: garis teal beriak mengikuti pointer, sorot amber
const bg=new T.Mesh(new T.PlaneGeometry(22,13),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:{value:0},s:{value:0},p:{value:new T.Vector2()}},
vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:`varying vec2 v;uniform float t,s;uniform vec2 p;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){vec2 q=(v-.5)*vec2(3.2,1.9);float d=length(q-p*vec2(3.2,-1.9));
float f=n(q*1.6+t*.05)+.5*n(q*3.4-t*.07)+.3*n(q*7.+vec2(0.,t*.03))-.35*exp(-d*d*2.)*(1.+s*2.);
float l=abs(fract(f*7.)-.5);float a=smoothstep(.05,0.,l)*.34*smoothstep(.75,.2,length(v-.5));
gl_FragColor=vec4(mix(vec3(.055,.486,.447),vec3(.96,.71,.24),smoothstep(.55,0.,d)),a);}`}));
bg.position.z=-8;sc.add(bg);
// partikel: struk larut lalu menyusun ulang jadi grafik batang (dari kabur jadi jelas)
const N=LT?900:(innerWidth<760||window.__ph)?1400:2600,aS=new Float32Array(N*3),aT=new Float32Array(N*3),aR=new Float32Array(N),aC=new Float32Array(N),bh=[.45,.7,.55,.85,1.15],y0=-1.35;
for(let i=0;i<N;i++){const b=Math.floor(Math.random()*5),ln=Math.random()<.12;
 aS.set([(Math.random()-.5)*1.05,(Math.random()-.5)*3.1,(Math.random()-.5)*.2],i*3);
 aT.set(ln?[(Math.random()-.5)*3.2,y0-.05,.7]:[-1.2+b*.6+(Math.random()-.5)*.36,y0+Math.random()*bh[b]*1.7,.7+(Math.random()-.5)*.12],i*3);
 aR[i]=Math.random();aC[i]=b==4&&!ln?1:0}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(new Float32Array(N*3),3));
[['aS',aS,3],['aT',aT,3],['aR',aR,1],['aC',aC,1]].forEach(([k,a,n])=>pg.setAttribute(k,new T.BufferAttribute(a,n)));
const PU={uP:{value:0},uT:{value:0},uRc:{value:new T.Vector3()},uSz:{value:55*r.getPixelRatio()}};
const pts=new T.Points(pg,new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:PU,
vertexShader:`attribute vec3 aS,aT;attribute float aR,aC;uniform float uP,uT,uSz;uniform vec3 uRc;varying float vE,vC;
void main(){float e=clamp((uP-aR*.35)/.65,0.,1.);e=e*e*(3.-2.*e);vec3 p=mix(uRc+aS,aT,e);
p+=vec3(sin(aR*40.+uT*.8),cos(aR*33.+uT*.6),sin(aR*21.))*.27*sin(e*3.1416);
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=uSz/-mv.z*(.7+.6*sin(e*3.1416));vE=e;vC=aC;}`,
fragmentShader:`varying float vE,vC;uniform float uP;
void main(){float a=smoothstep(.5,.12,length(gl_PointCoord-.5))*step(.002,uP);
vec3 c=mix(vec3(.96,.71,.24),mix(vec3(.055,.486,.447),vec3(.96,.71,.24),vC),vE);gl_FragColor=vec4(c,a*.9);}`}));
pts.frustumCulled=false;g.add(pts);
// ukuran & loop 9 detik
const om=orb.children[0].material;let small=false,vis=true,px=0,py=0,cx=0,cy=0,raf=0,sp=0,ss=0,os=1,bz=8,sg=0,sr=0;const clk=new T.Clock();
const rs=()=>{const W=host.clientWidth,Hh=host.clientHeight;small=W<760;r.setSize(W,Hh,false);cam.aspect=W/Hh;bz=small?10.5:8;cam.updateProjectionMatrix();os=small?.78:1};
const draw=()=>{const t=clk.getElapsedTime(),k=rm?.75:.5-.5*Math.cos(t/9*6.2832);
  sg+=((rm?0:Math.max(-3,Math.min(3,window.__traceV||0)))-sg)*.1;const sa=Math.abs(sg);sr+=sa*.045;
  const ia=rm?1:1-Math.pow(1-Math.min(Math.max(t-1.1,0)/1.8,1),3);ss+=(sp-ss)*.08;U.uD.value=Math.max(0,(ss-.2)/.8);PU.uP.value=rm?0:Math.min(1,Math.max(0,(ss-.15)/.5));PU.uT.value=t;PU.uRc.value.copy(small?orb.position:rc.position);cv.style.transform='translateY('+(ss*host.clientHeight*.45).toFixed(1)+'px)';bg.material.uniforms.t.value=t;bg.material.uniforms.s.value=ss+sa*.35;cam.position.z=bz-ss*1.6;cam.fov=32+sa*1.4;cam.updateProjectionMatrix();
  cx+=(px-cx)*.06;cy+=(py-cy)*.06;bg.material.uniforms.p.value.set(cx,cy);g.rotation.y=cx*.21;g.rotation.x=-cy*.21;
  host.style.setProperty('--px',cx.toFixed(3));host.style.setProperty('--py',cy.toFixed(3));
  orb.rotation.y=t*.08+ss*2.2+sr;{const q=os*(.55+.45*ia)*(1+ss*.3);orb.scale.set(q*(1-sa*.025),q*(1+sa*.06),q*(1-sa*.025))}orb.position.y=(small?.55:0)-sg*.05;om.iridescenceThicknessRange[1]=800+sa*260;core.scale.setScalar(2.6+sa*.35);
  sh.visible=!small;rc.visible=!small&&!H.classList.contains('ph-l');cd.visible=!small&&!H.classList.contains('ph-r');
  rc.position.set(-5+4.4*k-ss*2.4-(1-ia)*3,-.1+Math.sin(t*.7)*.06,.85);rc.rotation.set(0,.45,.12+Math.sin(t*.8)*.03-sg*.03);
  cd.position.set(5-4.35*k+ss*2.4+(1-ia)*3,.1+Math.sin(t*.6)*.06,1.1);cd.rotation.set(0,-.45,-.1+Math.sin(t*.7)*.03-sg*.03);
  r.render(sc,cam)};
let ft=0,fc=0,lp=performance.now();
const gov=()=>{const n=performance.now(),d=n-lp;lp=n;if(fc<0||d>200)return;fc++;if(fc>30)ft+=d;if(fc==120){if(ft/90>26&&r.getPixelRatio()>1){r.setPixelRatio(1);rs();H.classList.add('lite')}fc=-1}};
const fr=()=>{raf=0;draw();gov();go()},go=()=>{if(!raf&&vis&&!document.hidden&&!rm)raf=requestAnimationFrame(fr)};
new IntersectionObserver(e=>{vis=e[0].isIntersecting;go()}).observe(host);
document.addEventListener('visibilitychange',go);
if(!rm)addEventListener('scroll',()=>{sp=Math.min(1,scrollY/(host.clientHeight*.9))},{passive:true});
addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5},{passive:true});
new ResizeObserver(()=>{rs();draw()}).observe(host);
rs();draw();go();
}catch(e){console.warn('WebGL hero off → fallback CSS',e)}
