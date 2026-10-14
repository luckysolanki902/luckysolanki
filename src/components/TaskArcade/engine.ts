export const ARENA = { width: 1000, height: 620, floor: 570, lane: 250, playerWidth: 40, playerHeight: 63 };
export type Cue = 'shoot'|'subtask'|'complete'|'overdue'|'jump'|'pickup'|'level'|'game-over';
export type Task = {id:number;lane:number;x:number;y:number;w:number;h:number;title:string;total:number;left:number;settled:boolean;overdue?:boolean;fallSpeed?:number;collapseAt?:number;flash:number};
export type Shot = {id:number;x:number;y:number;vx:number;vy:number;life:number};
export type Reward = {id:number;title:string;x:number;y:number;age:number;fromX:number;fromY:number;vy:number;landed:boolean};
export type Particle = {x:number;y:number;vx:number;vy:number;life:number;color:string};
export type Input = {move:number;jump:boolean;fire:boolean;drop?:boolean};
export const LANE_CAPACITY = 7;
export type Deadline = {x:number;y:number;releaseAt:number};
export type Manager = {x:number;y:number;hp:number;maxHp:number;age:number;nextAttack:number;nextThrow:number;lane:number;hit:number;leaving:number};
export type State = {pressure:number;combo:number;lastClearLane:number;lastClearAt:number;deadline:Deadline|null;deathReason:"task"|"pressure";player:{x:number;y:number;vy:number;grounded:boolean;facing:number;shotAt:number;celebrateAt:number};tasks:Task[];shots:Shot[];rewards:Reward[];particles:Particle[];score:number;completed:number;level:number;time:number;nextSpawn:number;cooldown:number;seed:number;serial:number;dead:boolean;deathTime:number;coins:number;events:Cue[];laneBag:number[];lastLane:number;manager:Manager|null;nextManager:number;warning:{lane:number;until:number}|null};
const verbs=['Fix','Test','Document','Simplify','Review','Refactor','Validate','Optimize','Trace','Harden'];
const subjects=['login flow','webhook retries','cache layer','permissions','search API','upload queue','calendar sync','billing events','notifications','settings page','import worker','DB migration'];
export const TASK_TITLES=verbs.flatMap(verb=>subjects.map(subject=>`${verb} ${subject}`));
export function createGame(seed=Date.now()):State {return {pressure:0,combo:1,lastClearLane:-1,lastClearAt:-100,deadline:null,deathReason:"task",player:{x:375,y:ARENA.floor,vy:0,grounded:true,facing:1,shotAt:-1,celebrateAt:-1},tasks:[],shots:[],rewards:[],particles:[],score:0,completed:0,level:1,time:0,nextSpawn:4,cooldown:0,seed:seed>>>0,serial:0,dead:false,deathTime:0,coins:0,events:[],laneBag:[],lastLane:-1,manager:null,nextManager:14,warning:null};}
function random(s:State){s.seed=(1664525*s.seed+1013904223)>>>0;return s.seed/4294967296;}
function burst(s:State,x:number,y:number,color:string,n=10){for(let i=0;i<n;i++)s.particles.push({x,y,vx:(random(s)-.5)*220,vy:-60-random(s)*160,life:.6+random(s)*.3,color});}
// Include airborne cards when reserving space, so a pending stack cannot overflow.
export function laneLoad(s:State,lane:number){return s.tasks.filter(t=>t.lane===lane).length;}
export function nextLane(s:State):number {
 const loads=[0,1,2].map(lane=>laneLoad(s,lane));
 const lowest=Math.min(...loads);
 if(lowest>=LANE_CAPACITY)return -1;
 if(!s.laneBag.length){
  s.laneBag=[0,1,2];
  for(let i=2;i>0;i--){const j=Math.floor(random(s)*(i+1));[s.laneBag[i],s.laneBag[j]]=[s.laneBag[j],s.laneBag[i]];}
 }
 const choices=[...s.laneBag,...[0,1,2].filter(l=>!s.laneBag.includes(l))].filter(l=>loads[l]===lowest);
 const lane=choices.find(l=>l!==s.lastLane)??choices[0];
 s.laneBag=s.laneBag.filter(l=>l!==lane);s.lastLane=lane;return lane;
}
export function spawnTask(s:State,lane=nextLane(s)):Task {
 const total=Math.min(4,Math.floor(random(s)*(Math.min(4,s.level)+1)));
 const task={id:++s.serial,lane,x:lane*250+33,y:-80,w:184,h:72,title:TASK_TITLES[Math.floor(random(s)*TASK_TITLES.length)],total,left:total,settled:false,flash:0};s.tasks.push(task);return task;
}
export function hitTask(s:State,t:Task){
 if(t.left>0){t.left--;s.score+=10;t.flash=.18;s.events.push('subtask');burst(s,t.x+t.w/2,t.y+30,'#8ae3cb',4);return;}
 s.combo=t.lane!==s.lastClearLane&&s.time-s.lastClearAt<12?Math.min(3,s.combo+1):1;
 s.lastClearLane=t.lane;s.lastClearAt=s.time;s.pressure=Math.max(0,s.pressure-5);
 s.score+=50*s.combo;s.completed++;s.player.celebrateAt=s.time;s.events.push('complete');burst(s,t.x+t.w/2,t.y+30,'#c1a2ff',12);
 s.rewards.push({id:++s.serial,title:t.title,x:805+random(s)*140,y:Math.max(40,Math.min(ARENA.floor-100,t.y+30)),age:0,fromX:t.x+t.w/2,fromY:t.y+30,vy:0,landed:false});
 s.tasks=s.tasks.filter(task=>task.id!==t.id);
 const level=Math.min(10,1+Math.floor(s.completed/4)+Math.floor(s.time/25));if(level>s.level){s.level=level;s.events.push('level');}
}
function overlaps(x:number,y:number,w:number,h:number,t:Task){return x<t.x+t.w&&x+w>t.x&&y<t.y+t.h&&y+h>t.y;}
export function stepGame(s:State,input:Input,delta:number){
 const dt=Math.min(delta,1/30);s.events=[];
 for(const p of s.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=400*dt;p.life-=dt;}s.particles=s.particles.filter(p=>p.life>0);
 if(s.dead){s.deathTime+=dt;return;}
 s.time+=dt;
 const difficulty=Math.min(10,1+Math.floor(s.completed/4)+Math.floor(s.time/25));
 if(difficulty>s.level){s.level=difficulty;s.events.push('level');}
 s.cooldown=Math.max(0,s.cooldown-dt);
 const neglect=[0,1,2].reduce((sum,lane)=>sum+Math.max(0,s.tasks.filter(t=>t.lane===lane&&(t.overdue||t.settled)).length-2),0);
 s.pressure=Math.max(0,Math.min(100,s.pressure+(neglect?neglect*.85:-2)*dt));
 if(s.time-s.lastClearAt>12)s.combo=1;
 if(s.pressure>=100){s.dead=true;s.deathReason='pressure';s.events.push('game-over');return;}
 // Recheck the stack from the floor upward: losing one support releases
 // every card above it in the same tick, including the player's platform.
 const stacked=[...s.tasks].sort((a,b)=>b.y-a.y);
 for(const task of stacked){
  if(!task.settled)continue;
  const supported=Math.abs(task.y+task.h-ARENA.floor)<.5||s.tasks.some(other=>other.id!==task.id&&other.settled&&task.x<other.x+other.w&&task.x+task.w>other.x&&Math.abs(task.y+task.h-other.y)<.5);
  if(!supported){task.settled=false;task.overdue=true;task.fallSpeed=0;task.collapseAt=s.time+.8;}
 }
 const p=s.player;
 const speed=300;
 let nx=Math.max(23,Math.min(977,p.x+input.move*speed*dt));
 if(input.move)p.facing=Math.sign(input.move);
 for(const t of s.tasks.filter(t=>t.settled)){
  if(p.y>t.y+3&&p.y-ARENA.playerHeight<t.y+t.h-2&&nx+20>t.x&&nx-20<t.x+t.w){nx=input.move>0?t.x-20:input.move<0?t.x+t.w+20:p.x;}
 }
 p.x=nx;
 if(input.jump&&p.grounded){p.vy=-700;p.grounded=false;s.events.push('jump');}
 const oldY=p.y;
 p.vy+=(input.drop?2500:1250)*dt;p.y+=p.vy*dt;p.grounded=false;
 let support=ARENA.floor;
 for(const t of s.tasks.filter(t=>t.settled)){if(p.x+17>t.x&&p.x-17<t.x+t.w&&oldY<=t.y+3&&p.y>=t.y&&p.vy>=0)support=Math.min(support,t.y);}
 if(p.y>=support){p.y=support;p.vy=0;p.grounded=true;}
 if(input.fire&&s.cooldown<=0){
  const side=s.tasks.filter(t=>t.settled&&Math.abs(t.y+t.h/2-(p.y-32))<70&&Math.abs(t.x+t.w/2-p.x)<150).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
  const dir=side?Math.sign(side.x+side.w/2-p.x):0;
  s.shots.push({id:++s.serial,x:p.x+(dir?dir*22:0),y:p.y-40,vx:dir*600,vy:dir?0:-600,life:1.3});
  p.shotAt=s.time;s.cooldown=.22;s.events.push('shoot');
 }
 // A visible lane warning precedes every fall. Spawns never use Done.
 if(s.time>=s.nextSpawn-1.25&&!s.warning){const lane=nextLane(s);if(lane>=0)s.warning={lane,until:s.nextSpawn};}
 if(s.time>=s.nextSpawn){
  if(s.warning&&laneLoad(s,s.warning.lane)<LANE_CAPACITY&&s.tasks.filter(t=>!t.settled).length<Math.min(10,3+s.level))spawnTask(s,s.warning.lane);
  s.warning=null;s.nextSpawn=s.time+Math.max(.8,2.8-s.level*.22);
 }
 // A recurring manager telegraphs each mid-air task with a throwing wind-up.
 if(!s.manager&&s.time>=s.nextManager){const lane=nextLane(s);const hp=Math.min(9,6+Math.floor(s.level/3));s.manager={x:(lane<0?1:lane)*250+125,y:185,hp,maxHp:hp,age:0,nextAttack:s.time+2.5,nextThrow:s.time+2,lane:lane<0?1:lane,hit:0,leaving:0};s.events.push('level');}
 const manager=s.manager;
 if(manager){
  manager.age+=dt;manager.hit=Math.max(0,manager.hit-dt);
  if(manager.leaving>0){manager.leaving+=dt;if(manager.leaving>.8){s.manager=null;s.nextManager=s.time+Math.max(9,18-s.level);}}
  else {
   manager.x+=(manager.lane*250+125-manager.x)*Math.min(1,dt*6);
   if(s.time>=manager.nextThrow){
    if(laneLoad(s,manager.lane)<LANE_CAPACITY&&s.tasks.filter(t=>!t.settled).length<10){const task=spawnTask(s,manager.lane);task.y=Math.min(manager.y+35,...s.tasks.filter(t=>t.id!==task.id&&t.lane===manager.lane).map(t=>t.y-task.h-8));s.events.push('overdue');burst(s,manager.x,manager.y+25,'#ead79b',6);}
    const lane=nextLane(s);if(lane>=0)manager.lane=lane;manager.nextThrow=s.time+Math.max(1.5,2.8-s.level*.1);
   }
   if(s.time>=manager.nextAttack&&!s.deadline){
    // Snapshot the position before the wind-up. This attack never tracks a dodge.
    s.deadline={x:p.x,y:-70,releaseAt:s.time+1.4};manager.nextAttack=s.time+6;
   }
   if(manager.age>18)manager.leaving=.01;
  }
 }
 if(s.deadline&&s.time>=s.deadline.releaseAt){
  const d=s.deadline;const oldBottom=d.y+48;d.y+=430*dt;
  if(Math.abs(d.x-p.x)<49&&oldBottom<=p.y+3&&d.y+48>=p.y-ARENA.playerHeight&&d.y<p.y){s.dead=true;s.events.push('game-over');burst(s,p.x,p.y-35,'#f6a993',22);return;}
  if(d.y>ARENA.floor){burst(s,d.x,ARENA.floor,'#f6a993',12);s.deadline=null;}
 }
 for(const t of [...s.tasks].sort((a,b)=>b.y-a.y)){
  t.flash=Math.max(0,t.flash-dt);
  if(t.settled||(t.collapseAt!==undefined&&s.time<t.collapseAt))continue;
  const oldBottom=t.y+t.h;
  const speed=t.fallSpeed===undefined?68+s.level*12:(t.fallSpeed=Math.min(500,t.fallSpeed+800*dt));
  t.y+=speed*dt;
  // Sweep the lower edge through the player's body; no damage from settled cards.
  if(t.x<p.x+17&&t.x+t.w>p.x-17&&oldBottom<=p.y+3&&t.y+t.h>=p.y-ARENA.playerHeight&&t.y<p.y){
    s.dead=true;s.deathTime=0;s.events.push('game-over');burst(s,p.x,p.y-35,'#f6a993',22);return;
  }
  let floor=ARENA.floor;
  for(const other of s.tasks){if(other.id!==t.id&&other.settled&&t.x<other.x+other.w&&t.x+t.w>other.x&&oldBottom<=other.y+2)floor=Math.min(floor,other.y);}
  if(t.y+t.h>=floor){t.y=floor-t.h;t.settled=true;t.overdue=true;t.fallSpeed=undefined;s.events.push('overdue');burst(s,t.x+t.w/2,floor,'#d6aa6e',5);}
 }
 for(const shot of s.shots){
  const ox=shot.x,oy=shot.y;shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
  const candidates=s.tasks.filter(t=>overlaps(Math.min(ox,shot.x)-4,Math.min(oy,shot.y)-5,Math.abs(shot.x-ox)+8,Math.abs(shot.y-oy)+10,t));
  candidates.sort((a,b)=>Math.hypot(a.x+a.w/2-ox,a.y+a.h/2-oy)-Math.hypot(b.x+b.w/2-ox,b.y+b.h/2-oy));
  const enemy=s.manager;
  const enemyHit=enemy&&!enemy.leaving&&enemy.hit<=0&&shot.vy<0&&Math.abs(shot.x-enemy.x)<36&&oy>=enemy.y-30&&shot.y<=enemy.y+30;
  if(enemyHit&&(!candidates[0]||enemy.y+30>candidates[0].y+candidates[0].h)){
   enemy.hp--;enemy.hit=.4;shot.life=0;s.events.push('subtask');burst(s,enemy.x,enemy.y,'#dbc78e',8);
   if(enemy.hp===0){enemy.leaving=.01;s.deadline=null;s.score+=100;s.events.push('complete');}
  } else if(candidates[0]){hitTask(s,candidates[0]);shot.life=0;}
 }
 s.shots=s.shots.filter(shot=>shot.life>0&&shot.y>-20&&shot.x>-20&&shot.x<1020);
 // Coins share the same floor. They never stack into unreachable rewards.
 for(const r of s.rewards){
  r.age+=dt;
  if(r.age<.45)continue;
  r.vy+=780*dt;r.y+=r.vy*dt;
  if(r.y>=ARENA.floor-13){r.y=ARENA.floor-13;r.vy=0;r.landed=true;}
  if(Math.abs(r.x-p.x)<36&&r.y+13>p.y-ARENA.playerHeight&&r.y-13<p.y+4){s.coins++;s.score+=25;p.celebrateAt=s.time;s.events.push('pickup');burst(s,r.x,r.y,'#f9db83');r.age=-100;}
 }
 s.rewards=s.rewards.filter(r=>r.age>=0);
 // Bound visuals during long sessions without removing overdue collision obstacles.
 if(s.particles.length>160)s.particles=s.particles.slice(-160);
}
