import { test,expect } from '@playwright/test';
import { ARENA,TASK_TITLES,createGame,spawnTask,hitTask,stepGame,nextLane } from '../../src/components/TaskArcade/engine';
const idle={move:0,jump:false,fire:false};
test('120 meaningful task templates, seeded spawns, no falling Done tasks',()=>{
 expect(new Set(TASK_TITLES).size).toBeGreaterThanOrEqual(100);
 const a=createGame(24),b=createGame(24);
 for(let i=0;i<120;i++){const x=spawnTask(a),y=spawnTask(b);expect(x).toEqual(y);expect(x.lane).toBeLessThan(3);expect(x.total).toBeLessThanOrEqual(1);a.tasks=[];b.tasks=[];}
});
test('one subtask per hit and a separate final parent hit; rewards and difficulty',()=>{
 const s=createGame(3),t=spawnTask(s,0);t.total=2;t.left=2;
 hitTask(s,t);expect(t.left).toBe(1);expect(s.completed).toBe(0);expect(s.score).toBe(10);
 hitTask(s,t);expect(t.left).toBe(0);expect(s.tasks).toHaveLength(1);
 hitTask(s,t);expect(s.tasks).toHaveLength(0);expect(s.completed).toBe(1);expect(s.score).toBe(70);
 s.rewards[0].age=1;s.rewards[0].y=ARENA.floor-13;s.player.x=s.rewards[0].x;stepGame(s,idle,1/60);
 expect(s.coins).toBe(1);expect(s.score).toBe(95);expect(s.rewards).toHaveLength(0);
 for(let i=0;i<3;i++){const t=spawnTask(s,1);t.left=0;hitTask(s,t);}expect(s.level).toBe(2);
});
test('overdue cards settle, can be jumped on, and falling cards kill',()=>{
 const s=createGame(4),t=spawnTask(s,0);t.y=ARENA.floor-t.h-0.1;s.player.x=500;
 stepGame(s,idle,1/30);expect(t.settled).toBe(true);expect(s.dead).toBe(false);
 s.player.x=t.x+50;s.player.y=t.y-1;s.player.vy=100;s.player.grounded=false;
 stepGame(s,idle,1/30);expect(s.player.y).toBe(t.y);expect(s.player.grounded).toBe(true);expect(s.dead).toBe(false);
 const falling=spawnTask(s,0);falling.y=s.player.y-ARENA.playerHeight-falling.h-.1;
 stepGame(s,idle,1/30);expect(s.dead).toBe(true);expect(s.events).toContain('game-over');
 const fresh=createGame();expect(fresh.score).toBe(0);expect(fresh.dead).toBe(false);expect(fresh.tasks).toHaveLength(0);
});
test('projectiles do not pierce multiple tasks and grounded obstacles can be cleared',()=>{
 const s=createGame(8);s.player.x=125;const a=spawnTask(s,0),b=spawnTask(s,0);a.y=400;b.y=300;a.left=1;b.left=1;
 s.shots=[{id:900,x:125,y:490,vx:0,vy:-1000,life:1}];stepGame(s,idle,1/30);
 expect(a.left).toBe(0);expect(b.left).toBe(1);expect(s.shots).toHaveLength(0);
 s.tasks=[a];a.settled=true;a.y=ARENA.floor-a.h;a.left=0;s.player.x=230;
 for(let i=0;i<20;i++)stepGame(s,{...idle,fire:true},1/60);
 expect(s.completed).toBe(1);
});
test('assets decode and room pipe opens an accessible full-viewport game',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 await expect(page.getByRole('button',{name:'Turn background music off'})).toBeVisible();
 await page.getByRole('button',{name:'Jump to hit the laptop bonus block'}).click();
 await expect(page.getByRole('button',{name:'Jump to hit the laptop bonus block'})).toBeDisabled();
 await page.getByRole('button',{name:'Dismiss room guide'}).click();
 await expect(page.getByRole('button',{name:'Enter green pipe arcade'})).toBeVisible({timeout:10000});
 await page.getByRole('button',{name:'Enter green pipe arcade'}).click();
 const dialog=page.getByRole('dialog',{name:'Ship it task arcade'});await expect(dialog).toBeVisible();
 await expect(page.getByRole('complementary',{name:'Play tip'})).toBeVisible();
await expect(page.locator('#task-arena')).toHaveAttribute('data-mode','playing');
 await page.keyboard.down('Space');await page.waitForTimeout(400);await page.keyboard.up('Space');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('heading',{name:'Paused.'})).toBeVisible();
 await page.getByRole('button',{name:'Back to portfolio',exact:true}).click();await expect(dialog).toHaveCount(0);
 expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});

test('falling task ends a run, restart clears it, and exit is always reachable',async({page})=>{
 test.setTimeout(60000);
 await page.clock.install();await page.setViewportSize({width:1280,height:900});await page.goto('/');
 await expect(page.getByRole('button',{name:'Enter green pipe arcade'})).toBeVisible();
 await page.getByRole('button',{name:'Enter green pipe arcade'}).click();await page.clock.runFor(1000);
 await page.clock.runFor(6000);
 const arena=await page.locator('#task-arena').boundingBox();
 const task=await page.locator('#task-arena [aria-label*="subtasks done"]').first().boundingBox();
 const target=(task!.x+task!.width/2-arena!.x)/arena!.width*1000;
 const key=target<375?'ArrowLeft':'ArrowRight';await page.keyboard.down(key);await page.clock.runFor(Math.abs(target-375)/300*1000);await page.keyboard.up(key);
 await page.clock.runFor(23000);
 await expect(page.getByRole('heading',{name:'Too much on your plate.'})).toBeVisible();
 await expect(page.getByRole('button',{name:'← Portfolio',exact:true})).toBeVisible();
 await page.screenshot({path:'output/design/arcade/game-over.png'});
 await page.getByRole('button',{name:'Try again ↻'}).click();await expect(page.locator('#task-arena')).toHaveAttribute('data-mode','playing');
 await expect(page.locator('#task-arena')).toHaveAttribute('data-score','0');
 await expect(page.locator('#task-arena [aria-label*="subtasks done"]')).toHaveCount(0);
 await page.getByRole('button',{name:'← Portfolio',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('every completed task drops a coin onto the same reachable floor',()=>{
 const s=createGame(17);s.nextSpawn=1000;s.nextManager=1000;
 for(let i=0;i<3;i++){const t=spawnTask(s,i);t.y=80+i*100;t.left=0;hitTask(s,t);}
 for(let i=0;i<240;i++)stepGame(s,idle,1/60);
 expect(s.rewards).toHaveLength(3);
 for(const coin of s.rewards){expect(coin.y).toBe(ARENA.floor-13);expect(coin.landed).toBe(true);}
 s.player.x=770;
 for(let i=0;i<50;i++)stepGame(s,{...idle,move:1},1/60);
 expect(s.coins).toBe(3);expect(s.rewards).toHaveLength(0);
});

test('pipe entry clips the character at the mouth and restores it on exit',async({page})=>{
 await page.clock.install();await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const pipe=page.getByRole('button',{name:'Enter green pipe arcade'});await expect(pipe).toBeVisible();
 await pipe.click();await page.clock.runFor(350);
 const actor=page.locator('[aria-label="Lucky’s playable character"]');
 const geometry=await actor.evaluate(el=>{const c=getComputedStyle(el);const m=new DOMMatrix(c.transform);return {bottom:m.m42+parseFloat(c.translate.split(' ')[1])+272-parseFloat(c.clipPath.split(' ')[2]),clip:c.clipPath};});
 expect(geometry.clip).not.toBe('none');expect(geometry.bottom).toBeLessThanOrEqual(751);
 await page.screenshot({path:'output/design/arcade/pipe-entry-fixed.png'});
 await page.clock.runFor(600);await expect(page.locator('#task-arena')).toHaveAttribute('data-mode','playing');
 await page.getByRole('button',{name:'Dismiss play tip'}).click();await expect(page.locator('#task-arena')).toHaveAttribute('data-mode','playing');
 await page.screenshot({path:'output/design/arcade/game-inline-guide.png'});
 await page.getByRole('button',{name:'← Portfolio',exact:true}).click();
 await expect(actor).toHaveCSS('clip-path','none');await expect(actor).toHaveCSS('translate','none');
});

test('shuffled lanes are balanced without adjacent repeats',()=>{
 const s=createGame(91);let previous=-1;
 for(let batch=0;batch<100;batch++){
  const lanes=[];
  for(let i=0;i<3;i++){const lane=nextLane(s);expect(lane).not.toBe(previous);previous=lane;lanes.push(lane);}
  expect(new Set(lanes).size).toBe(3);
 }
});
test('manager throws from mid-screen, can be defeated and returns later',()=>{
 const s=createGame(51);s.player.x=950;s.nextSpawn=1000;s.nextManager=0;
 for(let i=0;i<150;i++)stepGame(s,idle,1/60);
 expect(s.manager).not.toBeNull();expect(s.tasks.length).toBeGreaterThan(0);expect(s.tasks[0].y).toBeGreaterThan(200);
 s.tasks=[];
 for(let i=0,n=s.manager!.hp;i<n;i++){
  const m=s.manager!;m.hit=0;
  s.shots=[{id:100+i,x:m.x,y:m.y+35,vx:0,vy:-600,life:1}];stepGame(s,idle,1/30);
 }
 expect(s.manager!.hp).toBe(0);expect(s.score).toBe(100);
 for(let i=0;i<60;i++)stepGame(s,idle,1/60);
 expect(s.manager).toBeNull();expect(s.nextManager).toBeGreaterThan(s.time);
 s.time=s.nextManager;stepGame(s,idle,1/60);expect(s.manager!.hp).toBeGreaterThanOrEqual(6);
});
test('a moving jump clears an entire grounded task',()=>{
 const s=createGame(4);s.nextSpawn=1000;s.nextManager=1000;
 const t=spawnTask(s,1);t.settled=true;t.y=ARENA.floor-t.h;
 s.player.x=235;
 for(let i=0;i<70;i++)stepGame(s,{move:1,jump:i===0,fire:false},1/60);
 expect(s.player.x).toBeGreaterThan(t.x+t.w+20);expect(s.dead).toBe(false);
});

test('manager sprite and mid-screen encounter render on desktop and touch layouts',async({page})=>{
 test.setTimeout(60000);await page.clock.install();await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 await page.getByRole('button',{name:'Enter green pipe arcade'}).click();await page.clock.runFor(1000);
 await page.keyboard.down('ArrowRight');await page.clock.runFor(1750);await page.keyboard.up('ArrowRight');
 await page.clock.runFor(12500);
 await expect(page.locator('[aria-label^="Recurring manager,"]')).toBeVisible();
 await page.screenshot({path:'output/design/arcade/manager-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('button',{name:'Fire code',exact:true})).toBeVisible();
 await page.screenshot({path:'output/design/arcade/manager-mobile.png'});
});

test('clearing the bottom of an overdue stack releases and re-stacks every card',()=>{
 const s=createGame(17);s.nextSpawn=1000;s.nextManager=1000;s.player.x=950;
 const stack=[0,1,2].map(i=>{const t=spawnTask(s,0);t.y=ARENA.floor-(i+1)*t.h;t.settled=true;t.left=0;return t;});
 hitTask(s,stack[0]);stepGame(s,idle,1/60);
 expect(stack[1].settled).toBe(false);expect(stack[2].settled).toBe(false);
 expect(stack[1].overdue).toBe(true);
 for(let i=0;i<120;i++)stepGame(s,idle,1/60);
 expect(stack[1].y+stack[1].h).toBe(ARENA.floor);expect(stack[2].y+stack[2].h).toBe(stack[1].y);
 expect(stack[1].settled&&stack[2].settled).toBe(true);
});
