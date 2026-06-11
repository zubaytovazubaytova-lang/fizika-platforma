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
  // pick the CAR specifically (not truck) — exact label match
  await page.locator('button, div[role="option"], li').filter({ hasText: /^\s*🚗?\s*Avtomobil\s*$/ }).last().click();
  await page.waitForTimeout(1800);

  const cx = box.x + box.width*0.19, cy = box.y + box.height*0.69;
  await page.mouse.move(cx, cy);
  for (let i=0;i<5;i++){ await page.mouse.wheel(0, -90); await page.waitForTimeout(200); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd6_car_t0.png' });

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  if (await startBtn.count()) await startBtn.click();
  await page.waitForTimeout(700);

  // zoom in much further for a clear close-up of the moving car (headlights vs direction of travel)
  const cx2 = box.x + box.width*0.19, cy2 = box.y + box.height*0.78;
  await page.mouse.move(cx2, cy2);
  for (let i=0;i<7;i++){ await page.mouse.wheel(0, -90); await page.waitForTimeout(150); }
  await page.waitForTimeout(250);
  await canvas.screenshot({ path: 'd6_car_t1.png' });
  await page.waitForTimeout(550);
  await canvas.screenshot({ path: 'd6_car_t2.png' });
  await page.waitForTimeout(550);
  await canvas.screenshot({ path: 'd6_car_t3.png' });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
