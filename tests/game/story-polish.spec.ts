import {test,expect} from '@playwright/test';
test('work evidence and animated origin fit desktop and mobile',async({page})=>{
 await page.setViewportSize({width:1280,height:900}); await page.goto('/');
 await page.locator('#work summary').first().click(); await expect(page.locator('#work')).toContainText('70+');
 await page.locator('#about').scrollIntoViewIfNeeded(); await page.screenshot({path:'output/design/implemented/origin-desktop.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.locator('[class*="storyBoy"]').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await page.setViewportSize({width:320,height:800});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
 await page.locator('#about').scrollIntoViewIfNeeded(); await page.screenshot({path:'output/design/implemented/origin-mobile.png'});
});
