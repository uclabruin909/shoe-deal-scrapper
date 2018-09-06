const puppeteer = require('puppeteer');
const Utils = require('../utils');

let sweep = async () => {
	const browser = await Utils.launchBrowser(); 
	
  const page = await browser.newPage();
  await Utils.preparePageForTests(page);
	await page.setViewport({ width: 1280, height: 800 });


	await page.goto('https://www.finishline.com/store/sale/men/shoes/_/N-1naclf7Z1737dkj?mnid=sale_men_shoes', {waitUntil: 'load'});

	// await page.waitForSelector('.productThumbnailItem');


};

sweep()
.catch((err) => {
	console.log(err);
}) ;