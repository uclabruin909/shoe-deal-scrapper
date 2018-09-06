const puppeteer = require('puppeteer');
const Utils = require('../utils');

let sweep = async () => {
	const browser = await Utils.launchBrowser(); 
	
	const page = await browser.newPage();
	await Utils.preparePageForTests(page);
	await page.setViewport({ width: 1280, height: 800 });

	
	await page.goto('https://shop.nordstrom.com/c/sale-mens-sneakers?breadcrumb=Home%2FSale%2FMen%2FShoes%2FSneakers%20%26%20Athletic', {waitUntil: 'networkidle2'});

	await page.waitForSelector('[data-element="touch-target product-module-media-link"]');

	let baseURL = await page.evaluate(() => {
		let protocol = window.location.protocol;
		let host = window.location.host;
		return `${protocol}//${host}`;
	});

	await console.log(baseURL);	

	let itemLinks = await page.$$eval('[data-element="touch-target product-module-media-link"]', (elems) => {
		return elems.map((el) => {
			let href = el.getAttribute('href');
			return href;
		});
	});

	await Promise.all([
	  page.waitForNavigation({waitUntil: 'load'}),
	  page.click('[data-element="page-number-2"]')
	]);	

	await page.waitForSelector('[data-element="touch-target product-module-media-link"]');

	console.log('page changed to 2');

	await page.waitFor(3000)

	let itemLinks2 = await page.$$eval('[data-element="touch-target product-module-media-link"]', (elems) => {
		return elems.map((el) => {
			let href = el.getAttribute('href');
			return href;
		});
	});	

	await Promise.all([
	  page.waitForNavigation({waitUntil: 'load'}),
	  page.click('[data-element="page-number-3"]')
	]);	

	await page.waitForSelector('[data-element="touch-target product-module-media-link"]');	

	console.log('page changed to 3')

	await page.waitFor(3000)

	let itemLinks3 = await page.$$eval('[data-element="touch-target product-module-media-link"]', (elems) => {
		return elems.map((el) => {
			let href = el.getAttribute('href');
			return href;
		});
	});	

	await console.log(itemLinks3);

};

sweep()
.catch((err) => {
	console.log(err);
}) ;