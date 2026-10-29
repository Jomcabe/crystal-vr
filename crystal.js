// Integer half-lattice coordinates keep all boundary keys exact.
export const STRUCTURES = Object.freeze({
  sc: {name: 'Simple cubic', atoms: 1, text: '8 corner atoms, each shared by 8 cells: 8 × 1/8 = 1 atom per conventional unit cell.'},
  bcc: {name: 'Body-centered cubic', atoms: 2, text: '8 corners contribute 1 atom; the body center contributes 1 whole atom: 2 atoms per conventional unit cell.'},
  fcc: {name: 'Face-centered cubic', atoms: 4, text: '8 corners contribute 1 atom; 6 face centers, each shared by 2 cells, contribute 3: 4 atoms per conventional unit cell.'}
});
export function generateCrystal(type, n) {
  if (!Object.hasOwn(STRUCTURES, type)) throw new RangeError('Unknown structure');
  if (!Number.isInteger(n) || n < 1 || n > 5) throw new RangeError('Repeat must be an integer from 1 to 5');
  const atoms = new Map();
  const put = (x,y,z,kind) => atoms.set(`${x},${y},${z}`, {x:x/2-n/2,y:y/2-n/2,z:z/2-n/2,kind});
  for(let x=0;x<=n;x++) for(let y=0;y<=n;y++) for(let z=0;z<=n;z++) put(2*x,2*y,2*z,'corner');
  if(type==='bcc') for(let x=0;x<n;x++) for(let y=0;y<n;y++) for(let z=0;z<n;z++) put(2*x+1,2*y+1,2*z+1,'body');
  if(type==='fcc') {
    for(let x=0;x<=n;x++) for(let y=0;y<n;y++) for(let z=0;z<n;z++) put(2*x,2*y+1,2*z+1,'face');
    for(let x=0;x<n;x++) for(let y=0;y<=n;y++) for(let z=0;z<n;z++) put(2*x+1,2*y,2*z+1,'face');
    for(let x=0;x<n;x++) for(let y=0;y<n;y++) for(let z=0;z<=n;z++) put(2*x+1,2*y+1,2*z,'face');
  }
  return [...atoms.values()];
}
// Each grid line spans the block: no duplicate coincident cell edges.
export function gridVertices(n) {
  const v=[]; const h=n/2;
  for(let a=0;a<=n;a++) for(let b=0;b<=n;b++) {
    v.push(-h,a-h,b-h,h,a-h,b-h, a-h,-h,b-h,a-h,h,b-h, a-h,b-h,-h,a-h,b-h,h);
  }
  return v;
}
