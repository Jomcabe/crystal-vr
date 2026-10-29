import {STRUCTURES, generateCrystal, gridVertices} from './crystal.js';
const $ = s => document.querySelector(s);
const state = {type:'sc', repeat:1, scale:1, x:0.25, y:-0.4, z:0};
const scene=$('a-scene'), root=$('#crystal'), menu=$('#vr-menu');
let group, mesh, edges, vrReadout, ready=false;
const STEP=Math.PI/12;
function transform(){
  if(!group) return;
  group.rotation.set(state.x,state.y,state.z);
  const s=1.65/state.repeat*state.scale;
  group.scale.setScalar(s);
  $('#scale-label').textContent=`Scale ${state.scale.toFixed(2)}×`;
}
function describe(atoms){
  const info=STRUCTURES[state.type], n=state.repeat;
  $('#structure').value=state.type; $('#repeat').value=n;
  $('#repeat-label').textContent=`${n} × ${n} × ${n}`;
  $('#structure-name').textContent=info.name;
  $('#explanation').textContent=info.text;
  $('#counts').textContent=`${info.atoms} atoms / conventional cell · ${n**3} cells · ${atoms.length} unique visible spheres. Fractionally assigned total: ${info.atoms*n**3} atoms.`;
  if(vrReadout) vrReadout.setAttribute('text','value',`${info.name}\n${n} x ${n} x ${n} | ${info.atoms} atoms/cell\n${atoms.length} visible | ${info.atoms*n**3} assigned\n${info.text}`);
}
function rebuild(){
  const atoms=generateCrystal(state.type,state.repeat);
  describe(atoms);
  if(!group) return;
  if(mesh){group.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();mesh.dispose();}
  if(edges){group.remove(edges);edges.geometry.dispose();edges.material.dispose();}
  const T=AFRAME.THREE;
  mesh=new T.InstancedMesh(new T.SphereGeometry(0.115,16,12),new T.MeshStandardMaterial({roughness:0.42,metalness:0.12}),atoms.length);
  const matrix=new T.Matrix4();
  const colors={corner:'#64b9ff',body:'#ffc56d',face:'#7cebd0'};
  atoms.forEach((a,i)=>{matrix.makeTranslation(a.x,a.y,a.z);mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(colors[a.kind]));});
  mesh.instanceMatrix.needsUpdate=true; mesh.instanceColor.needsUpdate=true; mesh.computeBoundingSphere();
  group.add(mesh);
  const geo=new T.BufferGeometry(); geo.setAttribute('position',new T.Float32BufferAttribute(gridVertices(state.repeat),3));
  edges=new T.LineSegments(geo,new T.LineBasicMaterial({color:'#b9cee7',transparent:true,opacity:0.55}));group.add(edges);
  transform();
}
function act(action){
  if(!ready)return;
  if(action==='next'){state.type={sc:'bcc',bcc:'fcc',fcc:'sc'}[state.type];rebuild();}
  else if(action==='repeat-'||action==='repeat+'){state.repeat=Math.max(1,Math.min(5,state.repeat+(action.endsWith('+')?1:-1)));rebuild();}
  else if(action==='reset'){Object.assign(state,{scale:1,x:0.25,y:-0.4,z:0});}
  else if(action==='larger'||action==='smaller'){state.scale=Math.max(0.4,Math.min(1.8,state.scale*(action==='larger'?1.1:1/1.1)));}
  else if(/^[xyz][+-]$/.test(action)){state[action[0]]+=action[1]==='+'?STEP:-STEP;}
  transform();
}
function buildMenu(){
  const panel=document.createElement('a-plane'); panel.setAttribute('width','1.36');panel.setAttribute('height','1.68');panel.setAttribute('color','#14273e');menu.append(panel);
  vrReadout=document.createElement('a-entity');vrReadout.setAttribute('position','0 0.55 0.012');vrReadout.setAttribute('text',{value:'Crystal VR',align:'center',width:1.2,wrapCount:43,color:'#eff8ff'});menu.append(vrReadout);
  const buttons=[['Structure >','next'],['Cells -','repeat-'],['Cells +','repeat+'],['X -','x-'],['X +','x+'],['Y -','y-'],['Y +','y+'],['Z -','z-'],['Z +','z+'],['Size -','smaller'],['Size +','larger'],['Reset','reset']];
  buttons.forEach(([label,action],i)=>{
    const b=document.createElement('a-plane');b.classList.add('vr-button');
    b.setAttribute('position',`${(i%3-1)*0.43} ${0.15-Math.floor(i/3)*0.22} 0.02`);b.setAttribute('width','0.40');b.setAttribute('height','0.18');b.setAttribute('color','#294966');
    b.setAttribute('text',{value:label,align:'center',color:'#ffffff',width:0.85,wrapCount:18});
    b.addEventListener('click',()=>act(action));b.addEventListener('mouseenter',()=>b.setAttribute('color','#477c8d'));b.addEventListener('mouseleave',()=>b.setAttribute('color','#294966'));menu.append(b);
  });
  const tip=document.createElement('a-entity');tip.setAttribute('position','0 -0.77 0.02');tip.setAttribute('text',{value:'Aim either ray + trigger to select\nBlue corners / gold body / mint faces',align:'center',width:1.18,wrapCount:44,color:'#b9d4e9'});menu.append(tip);
}
function input(canvas){
  const pointers=new Map();let pinch=0;
  const distance=()=>{const p=[...pointers.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0;};
  canvas.addEventListener('pointerdown',e=>{if(scene.is('vr-mode')||e.button>0)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);pinch=distance();});
  canvas.addEventListener('pointermove',e=>{
    const old=pointers.get(e.pointerId);if(!old||scene.is('vr-mode'))return;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===1){state.y+=(e.clientX-old.x)*0.008;state.x+=(e.clientY-old.y)*0.008;}
    else {const d=distance();if(pinch&&d)state.scale=Math.max(0.4,Math.min(1.8,state.scale*d/pinch));pinch=d;}
    transform();
  });
  const release=e=>{pointers.delete(e.pointerId);pinch=distance();};
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,release);
  canvas.addEventListener('wheel',e=>{if(scene.is('vr-mode'))return;e.preventDefault();state.scale=Math.max(0.4,Math.min(1.8,state.scale*Math.exp(-e.deltaY*0.001)));transform();},{passive:false});
  window.addEventListener('blur',()=>{pointers.clear();pinch=0;});
}
async function init(){
  if(ready)return;ready=true;
  group=new AFRAME.THREE.Group();root.setObject3D('crystal-model',group);
  buildMenu();rebuild();
  if(scene.canvas)input(scene.canvas);else scene.addEventListener('render-target-loaded',()=>input(scene.canvas),{once:true});
  $('#status').textContent='Ready. Drag to rotate; scroll or pinch to scale.';
  const button=$('#enter-vr');button.textContent='Checking immersive VR…';
  try {
    const supported=!!navigator.xr && await navigator.xr.isSessionSupported('immersive-vr');
    button.disabled=!supported;button.textContent=supported?'Enter VR':'VR unavailable on this browser';
    if(!supported)$('#status').textContent='3D controls ready. For immersive VR, open this HTTPS page in Meta Quest Browser.';
  }catch(error){button.textContent='VR availability check failed';$('#status').textContent=`3D is ready; VR check: ${error.message}`;}
}
$('#structure').addEventListener('change',e=>{state.type=e.target.value;rebuild();});
$('#repeat').addEventListener('input',e=>{state.repeat=Number(e.target.value);rebuild();});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action)));
$('#enter-vr').addEventListener('click',async()=>{try{await scene.enterVR();}catch(error){$('#status').textContent=`Cannot enter VR: ${error.message}`;}});
scene.addEventListener('enter-vr',()=>{menu.setAttribute('visible',true);document.body.classList.add('in-vr');});
scene.addEventListener('exit-vr',()=>{menu.setAttribute('visible',false);document.body.classList.remove('in-vr');$('#status').textContent='Exited VR. Desktop/touch controls ready.';});
if(window.AFRAME){if(scene.hasLoaded)init();else scene.addEventListener('loaded',init,{once:true});}
else{$('#status').textContent='3D library failed to load. Check your connection and reload.';$('#enter-vr').textContent='3D unavailable';}
// Stable read-only diagnostics for browser checks; no WebXR hardware claims.
window.crystalDebug={snapshot:()=>({...state,visibleAtoms:generateCrystal(state.type,state.repeat).length,instances:mesh?.count,rotation:group?.rotation.toArray(),drawCalls:scene.renderer?.info.render.calls})};
