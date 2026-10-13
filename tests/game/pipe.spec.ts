import {test,expect} from '@playwright/test';
import {newCharacter,requestJump,stepCharacter,ROOM_PIPE} from '../../src/components/GamePortfolio/character';
test('pipe is solid on both sides, can be landed on, and jumped over',()=>{
 const m=newCharacter(1500);
 for(let i=0;i<120;i++)stepCharacter(m,1,1/120,false,true);
 expect(m.x).toBe(ROOM_PIPE.left-24);
 requestJump(m);
 for(let i=0;i<35;i++)stepCharacter(m,1,1/120,false,true);
 for(let i=0;i<100;i++)stepCharacter(m,0,1/120,false,true);
 expect(m.z).toBe(ROOM_PIPE.height);expect(m.grounded).toBe(true);
 requestJump(m);
 for(let i=0;i<130;i++)stepCharacter(m,1,1/120,false,true);
 expect(m.x).toBeGreaterThan(ROOM_PIPE.right);expect(m.z).toBe(0);
 for(let i=0;i<160;i++)stepCharacter(m,-1,1/120,false,true);
 expect(m.x).toBe(ROOM_PIPE.right+24);
});
test('Enter on the pipe rim opens the arcade in the requested column order',async({page})=>{
 await page.clock.install();await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
 await page.getByLabel('Interactive room',{exact:true}).focus();
 await page.keyboard.down('ArrowRight');await page.clock.runFor(1700);
 await page.keyboard.down('Space');await page.clock.runFor(350);await page.keyboard.up('ArrowRight');
 await page.clock.runFor(700);await page.keyboard.up('Space');await page.clock.runFor(150);
 await page.keyboard.press('Enter');await page.clock.runFor(1000);
 await expect(page.locator('#task-arena')).toHaveAttribute('data-mode','playing');
 const columns=page.locator('[class*="columns"]>div');
 expect(await columns.allTextContents()).toEqual(['Backlog0','This week0','Today0','Done0']);
});
