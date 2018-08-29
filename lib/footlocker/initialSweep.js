const puppeteer = require('puppeteer');

let sweep = async () => {
	const browser = await puppeteer.launch({headless: false}); 
	const page = await browser.newPage();	
	await page.setViewport({ width: 1280, height: 800 });

	
	await page.goto('https://www.footlocker.com/category/sale.html', {waitUntil: 'load'});

	await page.waitForSelector('.main.c-search-results');

	await page.click('button#genderAge1');
	await page.waitForSelector('c-toggle.open');

	
};

sweep()
.catch((err) => {
	console.log(err);
}) ;