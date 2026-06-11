const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(1000);
  const inputs = await page.locator('input').all();
  console.log('input count', inputs.length);
  const email = `carcheck_${Date.now()}@test.local`;
  await inputs[0].fill('Car'); await inputs[1].fill('Check'); await inputs[2].fill(email);
  await inputs[3].fill('CarCheck123!'); await inputs[4].fill('CarCheck123!');
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
  await page.locator('button, div[role="option"], li').filter({ hasText: /^\s*🚗?\s*Avtomobil\s*$/ }).last().click();
  await page.waitForTimeout(1800);

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  if (await startBtn.count()) await startBtn.click();
  await page.waitForTimeout(2200);
  const pauseBtn = page.locator('button').filter({ hasText: /Pauza/i }).first();
  if (await pauseBtn.count()) await pauseBtn.click();
  await page.waitForTimeout(400);
  await canvas.screenshot({ path: 'dcar2_full.png' });

  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.37, cy = box.y + ch*0.75;
  await page.mouse.move(cx, cy);
  for (let i=0;i<5;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(180); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dcar2_close.png',
    clip: { x: box.x + cw*0.27, y: box.y + ch*0.70, width: cw*0.13, height: ch*0.18 } });

  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
