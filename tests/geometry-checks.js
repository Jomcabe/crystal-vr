import {generateCrystal,gridVertices,STRUCTURES} from '../crystal.js';
export function checkGeometry(){
  let assertions=0;const ok=(value,message)=>{assertions++;if(!value)throw Error(message);};
  for(const type of ['sc','bcc','fcc'])for(let n=1;n<=5;n++){
    const atoms=generateCrystal(type,n), h=n/2;
    const expected=(n+1)**3+(type==='bcc'?n**3:type==='fcc'?3*n*n*(n+1):0);
    ok(atoms.length===expected,`${type}/${n} count`);
    ok(new Set(atoms.map(a=>`${a.x},${a.y},${a.z}`)).size===atoms.length,`${type}/${n} deduplication`);
    let occupancy=0;
    for(const a of atoms){
      const p=[a.x,a.y,a.z];
      ok(p.every(v=>v>=-h&&v<=h),`${type}/${n} bounds`);
      const odd=p.filter(v=>Math.round((v+h)*2)%2!==0).length;
      ok(a.kind==='corner'?odd===0:a.kind==='body'?type==='bcc'&&odd===3:type==='fcc'&&odd===2,`${type}/${n} basis`);
      // Outer planes halve contributions, independently on each boundary axis.
      occupancy+=p.reduce((weight,v)=>weight*(Math.abs(v)===h?0.5:1),1);
    }
    ok(occupancy===STRUCTURES[type].atoms*n**3,`${type}/${n} fractional occupancy`);
    const vertices=gridVertices(n);ok(vertices.length===18*(n+1)**2,`${type}/${n} outline segment count`);
    const segments=new Set();
    for(let i=0;i<vertices.length;i+=6){const a=vertices.slice(i,i+3),b=vertices.slice(i+3,i+6);ok(a.filter((v,j)=>v!==b[j]).length===1,`${type}/${n} axis-aligned outline`);segments.add([a.join(','),b.join(',')].sort().join('|'));}
    ok(segments.size===vertices.length/6,`${type}/${n} deduplicated outline`);
  }
  for(const [type,n] of [['bad',1],['sc',0],['bcc',6],['fcc',1.5]]){let rejected=false;try{generateCrystal(type,n);}catch(e){rejected=e instanceof RangeError;}ok(rejected,'invalid input rejected');}
  return {cases:15,assertions};
}
