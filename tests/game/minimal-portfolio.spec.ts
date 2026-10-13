import { test, expect } from '@playwright/test';

test('portfolio navigation scrolls, work expands inline, and room stays compact', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Lucky Solanki.'})).toBeVisible();
  expect((await page.locator('#playable-room').boundingBox())!.height).toBeLessThan(330);
  await page.getByRole('navigation',{name:'Portfolio navigation'}).getByRole('link',{name:'Work',exact:true}).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('heading',{name:'Work experience.'})).toBeInViewport();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('#work summary').first().click();
  await expect(page.getByText('Building the Blitzit 3.0 backend:',{exact:false})).toBeVisible();
  await page.locator('#work summary').first().click();
  await expect(page.locator('#work details').first()).not.toHaveAttribute('open','');
  await page.reload();
  await expect(page.getByRole('heading',{name:'Work experience.'})).toBeInViewport();
  await expect(page.locator('#playable-room')).toHaveAttribute('data-phase','room');
});

test('stack selection, room marker scrolling, and sound settings work',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'PostgreSQL',exact:true}).click();
  await expect(page.locator('#skill-description')).toContainText('AutoRemov');
  for (const img of await page.locator('[aria-label="Technology skills"] img').all()) {
    expect(await img.evaluate((el:HTMLImageElement)=>el.complete && el.naturalWidth>0)).toBe(true);
  }
  await page.getByRole('navigation',{name:'Room shortcuts'}).getByRole('link',{name:'Skills',exact:true}).click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.getByRole('heading',{name:'Tech I work with.'})).toBeInViewport();
  await expect(page.getByRole('button',{name:'Turn background music off'})).toBeVisible();
  await page.getByRole('button',{name:'Turn interaction sounds off'}).click();
  await page.reload();
  await expect(page.getByRole('button',{name:'Turn background music off'})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Turn interaction sounds on'})).toHaveAttribute('aria-pressed','false');
});

test('mobile sections remain in flow and keyboard play is scoped to room',async({page})=>{
  await page.setViewportSize({width:320,height:740});
  await page.goto('/');
  await expect(page.locator('#playable-room')).toHaveAttribute('data-ready','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('navigation',{name:'Portfolio navigation'}).getByRole('link',{name:'Contact',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Have something in mind?'})).toBeInViewport();
  await page.goto('/');
  const actor=page.getByLabel('Lucky’s playable character');
  const before=await actor.getAttribute('style');
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(150);await page.keyboard.up('ArrowRight');
  expect(await actor.getAttribute('style')).toBe(before);
  await page.getByLabel('Interactive room',{exact:true}).focus();
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');
  expect(await actor.getAttribute('style')).not.toBe(before);
});
