const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck34_${Date.now()}@test.local`;
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
  await page.waitForTimeout(2000);
  const cw = box.width, ch = box.height;

  // zoom in tight around bike start position (~0.075, 0.785 from d33_afterzoom)
  const tx = box.x + cw*0.075, ty = box.y + ch*0.785;
  await page.mouse.move(tx, ty);
  for (let i=0;i<5;i++){ await page.mouse.wheel(0, -90); await page.waitForTimeout(150); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd34_zoom_static.png' });

  // start moving, then immediately PAUSE to freeze a frame mid-rotation, capture close static shot
  await page.locator('button').filter({ hasText: /Velosiped 5 m\/s/ }).first().click();
  await page.waitForTimeout(400);
  await page.locator('button').filter({ hasText: /Yeching/i }).first().click();
  await page.waitForTimeout(260);
  await page.locator('button').filter({ hasText: /Pauza/i }).first().click().catch(()=>{});
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd34_paused_A.png' });
  // tight crop near bike (camera target may have drifted very slightly — bike barely moved in 260ms)
  await page.screenshot({ path: 'd34_paused_A_crop.png',
    clip: { x: box.x + cw*0.30, y: box.y + ch*0.40, width: cw*0.30, height: ch*0.30 } });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
