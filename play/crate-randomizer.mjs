export const RANDOMIZER_VERSION=1;
export function randomizeCrates(base,seed){
 if(base.boss||base.miniBoss||base.hiddenRoom)return base;
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw Error('Invalid run seed');
 let state=seed>>>0;const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const key=(x,z)=>`${x},${z}`,walls=new Set(base.walls.map(p=>p.join(','))),safe=new Set();
 for(const[x,z]of [base.spawn,base.gate,...base.bots])for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.abs(dx)+Math.abs(dz)<=2)safe.add(key(x+dx,z+dz));
 const candidates=[];for(let z=1;z<base.rows-1;z++)for(let x=1;x<base.columns-1;x++)if(!walls.has(key(x,z))&&!safe.has(key(x,z)))candidates.push([x,z]);
 if(candidates.length<base.crates.length)throw Error('Insufficient safe crate cells');
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const crates=shuffle(candidates).slice(0,base.crates.length),pickupCells=shuffle(crates.map(p=>[...p]));
 const kinds=shuffle(['speed','bombs','range','life','shield','kick','freeze','push'].flatMap(k=>[k,k,k]));
 const hidden=kinds.map((kind,i)=>[...pickupCells[i],kind]);
 return {...base,seed,crates,hidden,runSeed:seed,randomizerVersion:RANDOMIZER_VERSION};
}

