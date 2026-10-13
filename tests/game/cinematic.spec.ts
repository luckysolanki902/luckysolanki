import {test,expect} from '@playwright/test';
test('cinematic portfolio remains readable and fits desktop and mobile',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/');await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');await page.waitForTimeout(1000);
 const room=await page.locator('#playable-room').boundingBox(); const title=await page.getByRole('heading',{name:'Lucky Solanki.'}).boundingBox(); expect(room!.y+room!.height).toBeLessThan(title!.y);
 await page.screenshot({path:'output/design/implemented/cinematic-desktop.png'});
 for(const width of [390,320]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await expect(page.getByRole('heading',{name:'Lucky Solanki.'})).toBeVisible();if(width===390)await page.screenshot({path:'output/design/implemented/cinematic-mobile.png'});}
});
