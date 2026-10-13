// Browser translation of the existing Furnace King combat rules.
export class Boss {
 constructor(){this.x=14;this.z=10;this.hp=this.maxHP=8;this.cooldown=0;this.moveClock=2;this.attackClock=3;this.warningClock=0;this.warning=[];this.targets=[];}
 hit(){if(this.hp<=0||this.cooldown>0)return false;this.hp--;this.cooldown=.65;if(this.hp===0){this.warning=[];this.targets=[];}return true;}
 step(dt,player,blocked,wall){
  if(this.hp<=0)return[];this.cooldown=Math.max(0,this.cooldown-dt);
  if(this.warning.length){this.warningClock-=dt;if(this.warningClock<=0){const fired=this.warning;this.warning=[];this.targets=[];this.attackClock=this.hp<=4?1.8:3;return fired;}return[];}
  this.moveClock-=dt;this.attackClock-=dt;
  const directions=[[0,-1],[0,1],[1,0],[-1,0]],inside=(x,z)=>x>0&&x<29&&z>0&&z<19;
  if(this.moveClock<=0){this.moveClock=.85;let best=[this.x,this.z],distance=Math.abs(player.x-this.x)+Math.abs(player.z-this.z);for(const[dx,dz]of directions){const[x,z]=[this.x+dx,this.z+dz],d=Math.abs(player.x-x)+Math.abs(player.z-z);if(inside(x,z)&&!blocked(x,z)&&d<distance){best=[x,z];distance=d;}}[this.x,this.z]=best;}
  if(this.attackClock<=0){const seen=new Set();const add=(x,z)=>{const k=`${x},${z}`;if(!seen.has(k)){seen.add(k);this.warning.push([x,z]);}};
   const cross=(center,range)=>{add(center.x,center.z);this.targets.push({...center});for(const[dx,dz]of directions)for(let i=1;i<=range;i++){const[x,z]=[center.x+dx*i,center.z+dz*i];if(!inside(x,z)||wall(x,z))break;add(x,z);}};
   cross(player,3);if(this.hp<=4)cross({x:this.x,z:this.z},2);this.warningClock=1.25;
  }return[];
 }
}
