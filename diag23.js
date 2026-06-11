const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck15_${Date.now()}@test.local`;
  await inputs[0].fill('Bike'); await inputs[1].fill('Check'); await inputs[2].fill(email);
  await inputs[3].fill('BikeCheck123!'); await inputs[4].fill('BikeCheck123!');
  await page.locator('button').filter({ hasText: /Ro.?yxatdan o.?tish/i }).first().click();
  await page.waitForTimeout(3500);

  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const search = page.locator('input[placeholder*="qidir" i]').first();
  await search.click(); await page.waitForTimeout(400);
  await page.keyboard.type('tezlik'); await page.waitForTimeout(900);
  await page.locator('button, a, li, div[role="button"], div[role="option"]').filter({ hasText: /tezlik/i }).last().click();
  await page.waitForTimeout(4000);
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  await page.locator('button').filter({ hasText: /Jism/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last().click();
  await page.waitForTimeout(2500);

  // bike sits stationary near flag A (left side, ~x rel 0.10-0.15)
  await canvas.screenshot({ path: 'd23_full.png' });

  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.16, cy = box.y + ch*0.74;
  await page.mouse.move(cx, cy);
  for (let i=0;i<6;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(180); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd23_zoom.png' });

  // orbit-drag in small steps, screenshotting each, to find a clean side angle on the stationary bike
  for (let step = 0; step < 6; step++) {
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 65, cy, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    await canvas.screenshot({ path: `d23_orbit${step}.png` });
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
