const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck17_${Date.now()}@test.local`;
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

  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.20, cy = box.y + ch*0.71;
  await page.mouse.move(cx, cy);
  for (let i=0;i<3;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(180); }
  await page.waitForTimeout(300);
  // bike near rel (0.044, 0.786) per d24_step3 -- crop tight around it with margin
  await page.screenshot({ path: 'd25_crop.png',
    clip: { x: box.x + cw*0.0, y: box.y + ch*0.65, width: cw*0.16, height: ch*0.30 } });

  // also orbit slightly to a more side-on angle
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 220, cy, { steps: 16 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd25_orbit_full.png' });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
