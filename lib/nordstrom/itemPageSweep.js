const puppeteer = require('puppeteer');

let sweep = async () => {
	const browser = await puppeteer.launch({headless: false}); 
	const page = await browser.newPage();	
	await page.setViewport({ width: 1280, height: 800 });

	
	await page.goto('https://shop.nordstrom.com/s/ted-baker-london-duuke-2-sneaker-men/4811030?origin=category-personalizedsort&breadcrumb=Home%2FSale%2FMen%2FShoes%2FSneakers%20%26%20Athletic&color=dark%20grey%20leather', {waitUntil: 'networkidle2'});

	await page.waitForSelector('[name="main-gallery-image"]');

	await page.click('[data-element="select-box"]');

	await page.waitForSelector('[data-element="size-dropdown-container"]');

	let shoeSizes = await page.$$eval('[data-element="touch-target size-dropdown-option"] span', (elems) => {
		return elems.map((el) => {
			let size = el.innerText;
			return parseFloat(size).toFixed(1);
		});
	});

	let shoeName;
	let company;
	let origPrice;
	let salePrice;
	let imagesUrl;
	let descriptions;

	console.log(shoeSizes);	
};

sweep()
.catch((err) => {
	console.log(err);
}) ;