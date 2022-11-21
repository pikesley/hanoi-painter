const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(`https://github.com/${process.argv[process.argv.length - 2]}`);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    `https://github.com/${process.argv[process.argv.length - 2]}`
  );
  await page.screenshot({
    path: `screens/${process.argv[process.argv.length - 1]}.png`,
    clip: {
      x: 646,
      y: 360,
      width: 947,
      height: 225,
    },
  });
  await page.screenshot({
    path: `screens/${process.argv[process.argv.length - 1]}-full.png`,
    fullPage: true,
  });

  await browser.close();
})();
