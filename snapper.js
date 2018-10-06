const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(`https://github.com/${ process.argv[process.argv.length - 2] }`);
  await page.goto(`https://github.com/${ process.argv[process.argv.length - 2] }`);
  await page.screenshot(
    {
      path: `screens/${ process.argv[process.argv.length - 1] }.png`,
      clip: {
	      x: 260, y:560, width: 745, height: 210
            }
    }
  );
  await page.screenshot(
    {
      path: `screens/${ process.argv[process.argv.length - 1] }-full.png`,
      fullPage: true
    }
  );

  await browser.close();
})();
