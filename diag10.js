const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 3 });
  // Register a fresh account and stay in that session (avoid separate /login which seems rate-limited)
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck2_${Date.now()}@test.local`;
  await inputs[0].fill('Bike');
  await inputs[1].fill('Check');
  await inputs[2].fill(email);
  await inputs[3].fill('BikeCheck123!');
  await inputs[4].fill('BikeCheck123!');
  await page.locator('button').filter({ hasText: /Ro.?yxatdan o.?tish/i }).first().click();
  await page.waitForTimeout(3500);
  console.log('post-register url:', page.url());

  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  console.log('sim url:', page.url());
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

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  if (await startBtn.count()) await startBtn.click();
  await page.waitForTimeout(2500);
  const pauseBtn = page.locator('button').filter({ hasText: /Pauza/i }).first();
  if (await pauseBtn.count()) await pauseBtn.click();
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd10_full.png' });

  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.327, cy = box.y + ch*0.80;
  await page.mouse.move(cx, cy);
  for (let i=0;i<13;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(150); }
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd10_close.png' });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
