const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck29_${Date.now()}@test.local`;
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

  // trigger movement via masala-solve flow
  const chip = page.locator('button[title*="Velosiped"]').first();
  console.log('chip count', await chip.count());
  await chip.click().catch(e => console.log('chip click failed', e.message.split('\n')[0]));
  await page.waitForTimeout(500);
  const solveBtn = page.locator('button').filter({ hasText: /Yechish/i }).first();
  console.log('yechish enabled?', await solveBtn.isEnabled().catch(()=> '?'));
  await solveBtn.click().catch(e => console.log('yechish click failed', e.message.split('\n')[0]));
  await page.waitForTimeout(1500);
  const pauseBtn = page.locator('button').filter({ hasText: /Pauza/i }).first();
  console.log('running now? pauza enabled:', await pauseBtn.isEnabled().catch(()=>'?'));

  // zoom WAY in on the bike — locate it first with a wide shot
  const cw = box.width, ch = box.height;
  await page.mouse.move(box.x + cw*0.20, box.y + ch*0.71);
  for (let i=0;i<6;i++){ await page.mouse.wheel(0, -110); await page.waitForTimeout(180); }
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: 'd29_zoomed.png' });

  // burst of close-up shots on the wheel area, faster interval, more frames
  for (let i=0;i<8;i++){
    await page.screenshot({ path: `d29_wheel${i}.png`,
      clip: { x: box.x + cw*0.10, y: box.y + ch*0.55, width: cw*0.45, height: ch*0.40 } });
    await page.waitForTimeout(160);
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
