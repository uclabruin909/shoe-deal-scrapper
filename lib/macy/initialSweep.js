const puppeteer = require('puppeteer');
const Utils = require('../utils');

let sweep = async () => {
	const browser = await puppeteer.launch({headless: false}); 
	
	const page = await browser.newPage();
	await Utils.preparePageForTests(page);
	await page.setViewport({ width: 1280, height: 800 });

	
	await page.goto('https://www.macys.com/shop/mens-clothing/sale-clearance/Shoe_type/Casual%20Shoes?id=43387', {waitUntil: 'networkidle2'});

	// await page.waitForSelector('.productThumbnailItem');

	
};

sweep()
.catch((err) => {
	console.log(err);
}) ;