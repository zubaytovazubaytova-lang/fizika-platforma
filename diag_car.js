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
  // pick the Car option (avtomobil / mashina / 🚗)
  await page.locator('button, div[role="option"], li').filter({ hasText: /[Aa]vtomobil|[Mm]ashina|🚗/ }).last().click();
  await page.waitForTimeout(1500);
  const cx = box.x + box.width*0.19, cy = box.y + box.height*0.69;
  await page.mouse.move(cx, cy);
  for (let i=0;i<5;i++){ await page.mouse.wheel(0, -90); await page.waitForTimeout(200); }
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'dcar_t0.png' });
  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  if (await startBtn.count()) { await startBtn.click(); }
  await page.waitForTimeout(700);
  await canvas.screenshot({ path: 'dcar_t1.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
