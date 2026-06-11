const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck42_${Date.now()}@test.local`;
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
  await page.waitForTimeout(600);
  await page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last().click();
  await page.waitForTimeout(1500);

  const cw = box.width, ch = box.height;
  await page.mouse.move(box.x + cw*0.20, box.y + ch*0.71);
  for (let i=0;i<3;i++){ await page.mouse.wheel(0, -70); await page.waitForTimeout(160); }
  await page.waitForTimeout(350);

  // crop tight on bike (rel ~0.073, 0.78 per d40_zoomed)
  const ccx=0.073, ccy=0.78, half=0.085;
  await page.screenshot({ path: 'd42_crop.png',
    clip: { x: box.x + cw*(ccx-half), y: box.y + ch*(ccy-half), width: cw*half*2, height: ch*half*2 } });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
