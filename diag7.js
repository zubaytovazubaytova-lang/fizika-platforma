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

  const cx = box.x + box.width*0.19, cy = box.y + box.height*0.69;
  await page.mouse.move(cx, cy);
  for (let i=0;i<5;i++){ await page.mouse.wheel(0, -90); await page.waitForTimeout(200); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd7_t0.png' });

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  if (await startBtn.count()) await startBtn.click();
  await page.waitForTimeout(3000);
  const pauseBtn = page.locator('button').filter({ hasText: /Pauza/i }).first();
  if (await pauseBtn.count()) await pauseBtn.click();
  await page.waitForTimeout(400);   // frozen now — no more timing pressure
  await canvas.screenshot({ path: 'd7_full.png' });

  // frozen — now safe to take a precise high-DPI crop right on the bike (rel ~0.327, 0.79 per d7_full)
  const cw = box.width, ch = box.height
  await page.screenshot({ path: 'd7_crop.png',
    clip: { x: box.x + cw*0.27, y: box.y + ch*0.72, width: cw*0.13, height: ch*0.16 } })

  // and dolly the orbit camera in too, since nothing will move while paused
  const cx2 = box.x + cw*0.327, cy2 = box.y + ch*0.79;
  await page.mouse.move(cx2, cy2);
  for (let i=0;i<6;i++){ await page.mouse.wheel(0, -85); await page.waitForTimeout(180); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd7_zoom1.png' });
  await page.screenshot({ path: 'd7_zoomcrop.png',
    clip: { x: box.x + cw*0.20, y: box.y + ch*0.60, width: cw*0.30, height: ch*0.36 } })

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
