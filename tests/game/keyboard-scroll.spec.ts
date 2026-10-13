import {test,expect} from '@playwright/test';
test('held Space and arrows never scroll the focused room; leaving releases movement',async({page})=>{
 await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
 const room=page.getByLabel('Interactive room',{exact:true});await room.focus();
 const y=await page.evaluate(()=>scrollY);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(100);
 await page.keyboard.down('Space');
 for(let i=0;i<12;i++){await page.keyboard.down('Space');await page.waitForTimeout(30);}
 await page.keyboard.up('Space');await page.keyboard.up('ArrowRight');
 for(const key of ['ArrowDown','ArrowUp']){await page.keyboard.down(key);await page.keyboard.down(key);await page.waitForTimeout(100);await page.keyboard.up(key);}
 expect(await page.evaluate(()=>scrollY)).toBe(y);await page.waitForTimeout(1000);
 await page.keyboard.down('ArrowLeft');await page.waitForTimeout(80);await page.keyboard.press('Tab');await page.waitForTimeout(200);
 const actor=page.getByLabel('Lucky’s playable character');const first=await actor.evaluate(el=>getComputedStyle(el).transform);
 await page.waitForTimeout(250);expect(await actor.evaluate(el=>getComputedStyle(el).transform)).toBe(first);await page.keyboard.up('ArrowLeft');
});
test('Space still scrolls normally outside the room and dismissing dialogue restores game focus',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Jump to hit the laptop bonus block'}).click();
 await page.getByRole('button',{name:'Dismiss room guide'}).click();await expect(page.getByLabel('Interactive room',{exact:true})).toBeFocused();
 await page.evaluate(()=>{(document.activeElement as HTMLElement).blur();window.scrollTo(0,0)});
 await page.keyboard.press('Space');await page.waitForTimeout(400);expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0);
});
test('losing DOM focus cannot hand a held Space gesture to the browser',async({page})=>{
 await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
 const room=page.getByLabel('Interactive room',{exact:true});await room.focus();
 const start=await page.evaluate(()=>scrollY);await page.keyboard.down('Space');
 await room.evaluate(el=>(el as HTMLElement).blur());
 for(let i=0;i<15;i++){await page.keyboard.down('Space');await page.waitForTimeout(30);}
 await page.keyboard.up('Space');await page.waitForTimeout(200);
 expect(await page.evaluate(()=>scrollY)).toBe(start);
 await room.focus();await page.keyboard.press('e');await page.keyboard.press('Escape');await page.waitForTimeout(300);
 expect(await page.evaluate(()=>scrollY)).toBe(start);expect(new URL(page.url()).hash).toBe('');
});
