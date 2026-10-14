import {test,expect} from '@playwright/test';
import {createGame,spawnTask,stepGame,hitTask,nextLane,laneLoad,LANE_CAPACITY,ARENA} from '../../src/components/TaskArcade/engine';
const idle={move:0,jump:false,fire:false};
function stack(s:ReturnType<typeof createGame>,lane:number,count:number){for(let i=0;i<count;i++){const t=spawnTask(s,lane);t.y=ARENA.floor-(i+1)*t.h;t.settled=true;t.overdue=true;}}
test('spawning chooses the emptiest available lane and skips full columns',()=>{
 const s=createGame(55);stack(s,0,7);stack(s,1,6);stack(s,2,2);
 expect(nextLane(s)).toBe(2);
 s.player.x=950;s.nextManager=1000;s.nextSpawn=0;s.warning={lane:0,until:0};stepGame(s,idle,1/60);
 expect(laneLoad(s,0)).toBe(LANE_CAPACITY);
 stack(s,1,1);stack(s,2,5);expect(nextLane(s)).toBe(-1);
 s.warning=null;s.nextSpawn=s.time;stepGame(s,idle,1/60);expect(s.tasks).toHaveLength(21);
});
test('manager reserves emptier lanes, has more health, and never adds to a full column',()=>{
 const s=createGame(12);stack(s,0,7);stack(s,1,6);s.player.x=950;s.nextSpawn=1000;s.nextManager=0;
 stepGame(s,idle,1/60);expect(s.manager!.lane).toBe(2);expect(s.manager!.hp).toBeGreaterThanOrEqual(6);
 s.manager!.lane=0;s.manager!.nextThrow=0;stepGame(s,idle,1/60);
 expect(laneLoad(s,0)).toBe(7);expect(s.manager!.lane).toBe(2);
});
test('pressure measures occupied capacity, including incoming tasks, without time drift',()=>{
 const s=createGame(2);s.nextSpawn=1000;s.nextManager=1000;s.player.x=875;
 stack(s,0,6);stack(s,1,6);
 expect(s.pressure).toBeCloseTo(12/21*100);
 for(let i=0;i<600;i++)stepGame(s,idle,1/60);
 expect(s.pressure).toBeCloseTo(12/21*100);
 stack(s,0,1);stack(s,1,1);expect(s.pressure).toBeCloseTo(100*2/3);
 const incoming=spawnTask(s,2);expect(incoming.settled).toBe(false);
 expect(s.pressure).toBeCloseTo(15/21*100);
 incoming.left=0;hitTask(s,incoming);expect(s.pressure).toBeCloseTo(14/21*100);
 stack(s,2,7);stepGame(s,idle,1/60);
 expect(s.dead).toBe(true);expect(s.deathReason).toBe('pressure');expect(s.pressure).toBe(100);
});
test('clearing frees only its own slot and rewards column rotation',()=>{
 const s=createGame(4);stack(s,0,6);stack(s,1,6);
 for(const lane of [0,1,2]){const t=spawnTask(s,lane);t.left=0;hitTask(s,t);}
 expect(s.pressure).toBeCloseTo(12/21*100);expect(s.score).toBe(300);expect(s.combo).toBe(3);
 const same=spawnTask(s,2);same.left=0;hitTask(s,same);expect(s.combo).toBe(1);
});
test('manager deadline locks before falling, can be dodged, and punishes standing still',()=>{
 for(const dodge of [false,true]){
  const s=createGame(8);s.nextSpawn=1000;s.nextManager=0;s.player.x=950;stepGame(s,idle,1/60);
  s.manager!.nextThrow=1000;s.manager!.nextAttack=0;stepGame(s,idle,1/60);
  expect(s.deadline!.x).toBe(950);expect(s.deadline!.releaseAt-s.time).toBeCloseTo(1.4);
  if(dodge)s.player.x=780;
  for(let i=0;i<60;i++)stepGame(s,idle,1/60);
  expect(s.deadline!.x).toBe(950);expect(s.deadline!.y).toBe(-70);expect(s.dead).toBe(false);
  for(let i=0;i<120;i++)stepGame(s,idle,1/60);
  expect(s.dead).toBe(!dodge);
 }
});
test('holding fire without moving eventually loses in every column across seeds',()=>{
 for(const seed of [4,17,51])for(const x of [125,375,625,875]){
  const s=createGame(seed);s.player.x=x;
  for(let i=0;i<60*180&&!s.dead;i++)stepGame(s,{...idle,fire:true},1/60);
  expect(s.dead,`seed ${seed}, x ${x}`).toBe(true);
  for(const lane of [0,1,2])expect(laneLoad(s,lane)).toBeLessThanOrEqual(7);
 }
});
test('room uses W and Up for jump, Space no longer jumps or scrolls; manager guide pauses encounter',async({page})=>{
 await page.clock.install();await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
 const room=page.getByLabel('Interactive room',{exact:true});await room.focus();
 await page.keyboard.down('a');await page.clock.runFor(1100);await page.keyboard.up('a');await page.clock.runFor(400);
 const actor=page.getByLabel('Lucky’s playable character');
 const y=await actor.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42);
 const scroll=await page.evaluate(()=>scrollY);
 await page.keyboard.press('Space');await page.clock.runFor(120);
 expect(await actor.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBeCloseTo(y,0);expect(await page.evaluate(()=>scrollY)).toBe(scroll);
 await page.keyboard.down('w');await page.clock.runFor(300);await page.keyboard.up('w');
 expect(await actor.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(y-5);
 await page.getByRole('button',{name:'Play arcade',exact:false}).click();await page.clock.runFor(1200);
 const tip=page.getByRole('complementary',{name:'Play tip'});await expect(tip).toContainText('A D');await tip.getByRole('button',{name:'Got it'}).click();
 await page.keyboard.down('d');await page.clock.runFor(2100);await page.keyboard.up('d');await tip.getByRole('button',{name:'Got it'}).click();
 await page.clock.runFor(6500);await expect(tip).toContainText('Unsupported stacks');await tip.getByRole('button',{name:'Got it'}).click();
 await page.clock.runFor(7000);await expect(tip).toContainText('recurring manager');
 const manager=page.locator('[aria-label^="Recurring manager,"]');const style=await manager.getAttribute('style');await page.clock.runFor(1500);expect(await manager.getAttribute('style')).toBe(style);
 await page.screenshot({path:'output/design/arcade/manager-guide-balanced.png'});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/design/arcade/manager-guide-balanced-mobile.png'});
});
