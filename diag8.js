const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 3 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('input[type="email"]').first().fill('wheelcheck3@test.local');
  await page.locator('input[type="password"]').first().fill('WheelCheck123!');
  await page.locator('button:has-text("Kirish")').first().click();
  await page.waitForTimeout(2500);
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const search = page.locator('input[placeholder*="qidir" i]').first();
  await search.click(); await page.waitForTimeout(500);
  await page.keyboard.type('tezlik'); await page.waitForTimeout(1000);
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

  // Now zoom WAY in on the bike — use heavy scroll at the bike's screen position
  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.327, cy = box.y + ch*0.80;
  await page.mouse.move(cx, cy);
  for (let i=0;i<14;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(150); }
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd8_close.png' });

  // orbit-drag slightly to get a clearer side angle (drag horizontally)
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 120, cy, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd8_side1.png' });

  await page.mouse.move(cx-120, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 220, cy, { steps: 16 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'd8_side2.png' });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
