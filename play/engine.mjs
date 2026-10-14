import {modes,modeKey} from './modes.mjs';
import {botDifficulty} from './difficulty.mjs';
import {Boss} from './boss.mjs?v=2';
import reference from './level1.mjs?v=24';
export const VERSION='browser-0.8.3';
export const COLS=30,ROWS=20,DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
export function cameraDirection(direction,angle){let[x,z]=direction;const quarter=((Math.round(angle/(Math.PI/2))%4)+4)%4;for(let i=0;i<quarter;i++)[x,z]=[z,-x];return[x,z];}
export const key=(x,z)=>`${x},${z}`;
const same=(a,b)=>a.x===b.x&&a.z===b.z;
function random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function visual(a){if(!a.move)return {x:a.x,z:a.z};const t=Math.min(1,a.move.t/a.move.duration);return {x:a.x+(a.move.x-a.x)*t,z:a.z+(a.move.z-a.z)*t};}
export function layout(seed=20261001,definition=reference){
 const reference=definition;
 const floor=new Set();for(let x=0;x<COLS;x++)for(let z=0;z<ROWS;z++)floor.add(key(x,z));
 const walls=new Set(reference.walls.map(([x,z])=>key(x,z))),crates=new Set(reference.crates.map(([x,z])=>key(x,z))),hidden=new Map(reference.hidden.map(([x,z,kind])=>[key(x,z),({remote:'freeze',magnet:'push'})[kind]||kind]));
 const point=([x,z])=>({x,z});return {floor,walls,crates,hidden,spawn:point(reference.spawn),gate:point(reference.gate),bots:reference.bots.map(point)};
}
export class Game {
 constructor(seed=20261001,definition=reference,options={}){this.mode=modeKey(options.mode);this.continues=modes[this.mode].continues;this.seed=seed;this.definition=definition;this.level=definition.level||1;this.entry=null;this.events=[];this.reset();}
 advance(definition){this.entry={up:{...this.up},score:this.score,time:this.time,freezeUntil:this.freezeUntil,circuitMask:this.circuitMask,roomVisited:this.roomVisited};this.definition=definition;this.level=definition.level;this.seed=definition.seed;this.reset();}
 reset(){const l=layout(this.seed,this.definition);Object.assign(this,l);this.boss=this.definition.boss?new Boss(this.definition.boss):null;this.bots=l.bots.map((b,i)=>({...b,id:i,alive:true,move:null,think:botDifficulty(this.level).startDelay+i*.3,lastDir:null}));this.player={...l.spawn,move:null};this.bombs=new Map();this.fire=new Map();this.pickups=new Map();this.up={speed:0,bombs:1,range:2,shield:0,life:modes[this.mode].lives,kick:0,freeze:0,push:0};this.freezeUntil=0;this.circuitMask=0;this.roomVisited=0;this.time=0;this.score=0;this.defeated=0;this.state='playing';this.portalActive=false;this.invincible=this.level===1?4:2;this.events=[];this.dying=0;if(this.entry){this.up={...this.up,...this.entry.up};this.up.push=this.entry.up.push??this.entry.up.magnet??0;delete this.up.remote;delete this.up.magnet;this.circuitMask=this.entry.circuitMask||0;this.roomVisited=this.entry.roomVisited||0;this.score=this.entry.score;this.time=this.entry.time;this.freezeUntil=this.entry.freezeUntil||0;this.up.freeze=this.freezeUntil>this.time?1:0;}}
 blocked(x,z,actor=null){const k=key(x,z);return !!(this.boss&&this.boss.hp>0&&this.boss.x===x&&this.boss.z===z&&actor!==this.boss)||!this.floor.has(k)||this.walls.has(k)||this.crates.has(k)||(this.bombs.has(k)&&!(actor&&same(actor,this.bombs.get(k))));}
 emit(type,data={}){this.events.push({type,...data});}
 takeEvents(){const e=this.events;this.events=[];return e;}
 moveActor(a,dx,dz,duration){if(a.move)return false;const x=a.x+dx,z=a.z+dz,k=key(x,z);if(a===this.player&&(this.up.kick||this.up.push)&&this.bombs.has(k))this.kick(x,z,dx,dz);if(this.blocked(x,z,a))return false;a.move={x,z,t:0,duration};a.lastDir=[dx,dz];return true;}
 kick(x,z,dx,dz){const old=key(x,z),b=this.bombs.get(old);if(!b)return false;let steps=0;for(let i=1;i<=(this.up.push?2:1);i++){const nx=x+dx*i,nz=z+dz*i;if(this.blocked(nx,nz)||this.bots.some(a=>a.alive&&((a.x===nx&&a.z===nz)||(a.move&&a.move.x===nx&&a.move.z===nz))))break;steps=i;}if(!steps)return false;this.bombs.delete(old);b.x=x+dx*steps;b.z=z+dz*steps;this.bombs.set(key(b.x,b.z),b);this.emit('kick');return true;}

 placeBomb(){if(this.state!=='playing'||this.dying)return false;const k=key(this.player.x,this.player.z);if(this.bombs.has(k)||this.bombs.size>=this.up.bombs)return false;this.bombs.set(k,{x:this.player.x,z:this.player.z,t:2.35,range:this.up.range});this.emit('place');return true;}

 explode(start){if(!this.bombs.has(start))return;const b=this.bombs.get(start);this.bombs.delete(start);this.emit('blast',{x:b.x,z:b.z});const add=(x,z)=>{const k=key(x,z);this.fire.set(k,{until:this.time+.62});if(this.boss&&this.boss.x===x&&this.boss.z===z&&this.boss.hit()){this.emit('bosshit');if(this.boss.hp===0){this.defeated=1;this.score+=150;this.emit('bot',{id:'boss'});}}if(this.pickups.has(k))this.pickups.delete(k);};add(b.x,b.z);
  for(const [dx,dz]of DIRS)for(let i=1;i<=b.range;i++){const x=b.x+dx*i,z=b.z+dz*i,k=key(x,z);if(!this.floor.has(k)||this.walls.has(k))break;add(x,z);if(this.crates.has(k)){this.crates.delete(k);this.score+=10;if(this.hidden.has(k)){this.pickups.set(k,{kind:this.hidden.get(k),ready:this.time+.62});this.hidden.delete(k);}this.emit('crate',{x,z});break;}if(this.bombs.has(k)){this.explode(k);break;}}
 }
 damage(){if(this.state!=='playing'||this.invincible>0||this.dying)return;if(this.up.shield>0){this.up.shield--;this.invincible=1.5;this.emit('shield');return;}this.up.life--;this.player.move=null;this.dying=.8;this.emit('hit');if(this.up.life<=0){this.state='gameover';this.emit('gameover');}}
 pickup(k){const p=this.pickups.get(k);if(!p||p.ready>this.time)return;this.pickups.delete(k);const kind=p.kind;if(kind==='life'){if(this.mode!=='hardcore')this.up.life=Math.min(9,this.up.life+1);}else if(kind==='speed')this.up.speed=Math.min(5,this.up.speed+1);else if(kind==='bombs')this.up.bombs=Math.min(6,this.up.bombs+1);else if(kind==='range')this.up.range=Math.min(8,this.up.range+1);else if(kind==='freeze'){this.freezeUntil=this.time+5;this.up.freeze=1;}else this.up[kind]=Math.min(kind==='shield'?5:1,this.up[kind]+1);this.score+=100;this.emit('pickup',{kind});}
 continueRun(){if(this.mode!=='arcade'||this.state!=='gameover'||this.continues<=0)return false;this.continues--;this.entry={up:{...this.up,life:3},score:this.score,time:this.time,circuitMask:this.circuitMask,roomVisited:this.roomVisited};this.reset();return true;}
 pause(){if(this.state==='playing')this.state='paused';else if(this.state==='paused')this.state='playing';}
 step(dt,direction=null){if(this.state!=='playing')return;dt=Math.max(0,Math.min(dt,.04));this.time+=dt;this.invincible=Math.max(0,this.invincible-dt);const frozen=this.freezeUntil>this.time;if(!frozen)this.up.freeze=0;
  for(const[k,f]of this.fire)if(f.until<=this.time)this.fire.delete(k);
  for(const[k,b]of [...this.bombs]){b.t-=dt;if(b.t<=0)this.explode(k);}
  const actors=[this.player,...this.bots.filter(b=>b.alive&&!frozen)];for(const a of actors)if(a.move){a.move.t+=dt;if(a.move.t>=a.move.duration){a.x=a.move.x;a.z=a.move.z;a.move=null;}}
  if(this.dying>0){this.dying-=dt;if(this.dying<=0){this.dying=0;Object.assign(this.player,this.spawn,{move:null});this.invincible=2.5;}}
  else if(direction)this.moveActor(this.player,direction[0],direction[1],.2/(1+this.up.speed*.13));
  for(const b of this.bots){if(!b.alive)continue;const p=visual(b);if(this.fire.has(key(Math.round(p.x),Math.round(p.z)))){b.alive=false;b.move=null;this.defeated++;this.score+=150;this.emit('bot',{id:b.id});continue;}
   if(frozen||b.move)continue;b.think-=dt;if(b.think<=0){b.think=botDifficulty(this.level).thinkSeconds;const options=DIRS.filter(([dx,dz])=>!this.blocked(b.x+dx,b.z+dz,b));const r=random(this.seed+Math.floor(this.time*17)+b.id*77);let choices=options;
    // Slow reaction: only obvious live flames are avoided, no perfect fuse prediction.
    if(r()<botDifficulty(this.level).flameAvoidance){const safe=options.filter(([dx,dz])=>!this.fire.has(key(b.x+dx,b.z+dz)));if(safe.length)choices=safe;}
    if(choices.length){const d=choices[Math.floor(r()*choices.length)];this.moveActor(b,d[0],d[1],botDifficulty(this.level).moveSeconds);}
   }
  }
  if(this.boss&&!frozen){const fired=this.boss.step(dt,{x:this.player.x,z:this.player.z},(x,z)=>this.blocked(x,z,this.boss),(x,z)=>this.walls.has(key(x,z)));if(fired.length){for(const[x,z]of fired){const k=key(x,z);this.fire.set(k,{until:this.time+.65});if(this.bombs.has(k))this.explode(k);}this.emit('blast');}}
  const p=visual(this.player),pk=key(Math.round(p.x),Math.round(p.z));if(!this.dying&&(this.fire.has(pk)||(this.boss&&this.boss.hp>0&&Math.hypot(this.boss.x-p.x,this.boss.z-p.z)<.5)||this.bots.some(b=>b.alive&&Math.hypot(visual(b).x-p.x,visual(b).z-p.z)<.5)))this.damage();
  if(this.state!=='playing')return;
  if(!this.dying){this.pickup(pk);}
  if((this.boss?this.boss.hp<=0:this.defeated===this.bots.length)&&!this.portalActive){this.portalActive=true;this.emit('portal');}
  if(this.portalActive&&!this.player.move&&!this.dying&&same(this.player,this.gate)){this.state='complete';this.score+=1000;this.emit('complete');}
 }
}

