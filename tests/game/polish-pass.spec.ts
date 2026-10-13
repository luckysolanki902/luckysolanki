import {test,expect} from '@playwright/test';
import {createGame,spawnTask,stepGame,hitTask,ARENA} from '../../src/components/TaskArcade/engine';
test('collapsing stacks wait before dropping',()=>{
 const s=createGame(12);s.player.x=950;s.nextSpawn=1000;s.nextManager=1000;
 const bottom=spawnTask(s,0);bottom.y=ARENA.floor-bottom.h;bottom.settled=true;bottom.left=0;
 const top=spawnTask(s,0);top.y=bottom.y-top.h;top.settled=true;const y=top.y;
 hitTask(s,bottom);for(let i=0;i<35;i++)stepGame(s,{move:0,jump:false,fire:false},1/60);
 expect(top.y).toBe(y);expect(top.collapseAt).toBeGreaterThan(s.time);
 for(let i=0;i<60;i++)stepGame(s,{move:0,jump:false,fire:false},1/60);
 expect(top.y).toBeGreaterThan(y);
});
test('themes, logos, reviews and short origin render',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByText('Piyush Tiwari',{exact:true})).toBeVisible();
 await expect(page.getByAltText('Blitzit 3.0 task board with sample tasks')).toBeVisible();
 await page.locator('#work').scrollIntoViewIfNeeded();await page.screenshot({path:'output/design/implemented/work-expanded.png'});
 await page.getByRole('button',{name:'Switch to day mode'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.goto('/stories/journey');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.goto('/');await page.getByRole('button',{name:'Switch to night mode'}).click();await page.goto('/stories/journey');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.waitForTimeout(800);await page.screenshot({path:'output/design/implemented/story-dark.png'});
 await page.goto('/');await page.getByRole('button',{name:'Switch to day mode'}).click();await page.waitForTimeout(1000);await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.screenshot({path:'output/design/implemented/day-mode.png'});
 await page.setViewportSize({width:390,height:844});await page.locator('#about').scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);await page.screenshot({path:'output/design/implemented/about-short-mobile.png'});
});
test('direct arcade entry and paused conversations preserve board geometry',async({page})=>{
 await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
 await page.getByRole('button',{name:'Play arcade',exact:false}).click();
 await expect(page.getByRole('dialog',{name:'Ship it task arcade'})).toBeVisible();
 const tip=page.getByRole('complementary',{name:'Play tip'});await expect(tip).toBeVisible();
 const box=await page.locator('#task-arena').boundingBox();const actor=page.getByLabel('Lucky coding with a laptop');const style=await actor.getAttribute('style');await page.waitForTimeout(500);expect(await actor.getAttribute('style')).toBe(style);
 await tip.getByRole('button',{name:'Got it'}).click();await expect(tip).toHaveCount(0);expect(await page.locator('#task-arena').boundingBox()).toEqual(box);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(2400);await page.keyboard.up('ArrowRight');await expect(tip).toContainText('Hold Space');
 await page.screenshot({path:'output/design/arcade/conversation-fixed.png'});
 await tip.getByRole('button',{name:'Got it'}).click();await page.getByRole('button',{name:'Game menu',exact:true}).click();await expect(page.getByRole('button',{name:'BGM off',exact:true})).toBeVisible();await page.waitForTimeout(400);await page.screenshot({path:'output/design/arcade/menu-settings.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/design/arcade/menu-mobile.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
});

test('audio suspends on page focus loss without changing preferences',async({page})=>{
 await page.addInitScript(()=>{const Native=window.AudioContext;const contexts:AudioContext[]=[];(window as unknown as {audioTest:AudioContext[]}).audioTest=contexts;window.AudioContext=class extends Native{constructor(options?:AudioContextOptions){super(options);contexts.push(this);}};});
 await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');await page.getByLabel('Interactive room',{exact:true}).click();
 await expect(page.getByRole('button',{name:'Turn background music on'})).toHaveAttribute('aria-pressed','false');
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {audioTest:AudioContext[]}).audioTest.length)).toBe(0);
 await page.getByRole('button',{name:'Turn background music on'}).click();
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {audioTest:AudioContext[]}).audioTest[0]?.state)).toBe('running');
 await page.evaluate(()=>{Object.defineProperty(document,'hasFocus',{configurable:true,value:()=>false});window.dispatchEvent(new Event('blur'));});
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {audioTest:AudioContext[]}).audioTest[0]?.state)).toBe('suspended');
 await page.evaluate(()=>{Object.defineProperty(document,'hasFocus',{configurable:true,value:()=>true});window.dispatchEvent(new Event('focus'));});
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {audioTest:AudioContext[]}).audioTest[0]?.state)).toBe('running');
 await expect(page.getByRole('button',{name:'Turn background music off'})).toHaveAttribute('aria-pressed','true');
});
