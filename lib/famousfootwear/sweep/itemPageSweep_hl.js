const puppeteer = require('puppeteer');
const Utils = require('../../utils');

const sweepConfig = require('./config/sweepConfig.json');
const selectKeys = sweepConfig.itemSweep.selectKeys;

let sweepURL = async (url) => {
	const browser = await Utils.launchBrowser(); 
	
	//configure page instance
	const page = await browser.newPage();
	await Utils.preparePageForTests(page);
	await page.setViewport({ width: 1480, height: 1000 });

	//direct page to url and wait 
	//until availe size dropdown options are avail to ensure page fully loaded
	await page.goto(url, {waitUntil: 'networkidle2'});
	await page.waitForSelector(selectKeys['availSize']);


	let shoeName = await page.$eval(selectKeys['name'], (el) => {
		let name = el.innerText.trim();
		return window.helpers.removeBackSpaceChar(name);

	});

	let origPrice = await page.$eval(selectKeys['origPrice'], (el) => {
		let price = el.innerText.trim();
		price = window.helpers.extractPriceFromString(price);
		// convert to float number
		return window.helpers.convertToFloatNumber(price);

	});

	let curPrice = await page.$eval(selectKeys['curPrice'], (el) => {
		let price = el.innerText.trim();
		price = window.helpers.extractPriceFromString(price);
		// convert to float number
		return window.helpers.convertToFloatNumber(price);

	});

	let imgSrc = await page.$eval(selectKeys['imgSrc'], (el) => {
		let src = el.getAttribute('src');
		//if src path does not have base url, construct with protocol & host
		if (!window.helpers.hasBaseURL(src)) {
			let protocol = window.location.protocol;
			let host = window.location.host;
			let baseURL = `${protocol}//${host}`;
			return `${baseURL}${src}`; 			
		} else {
			return src;
		}

	});	

	let availSizes = await page.$$eval(selectKeys['availSize'], (elements) => {
		let results = [];
		elements.forEach((el) => {
			let sizeText = window.helpers.extractSizeFromString(el.innerText.trim());
			let size = window.helpers.convertToFloatNumber(sizeText);
			if (typeof size === 'number' && !isNaN(size)) {
				results.push(size);
			}
		});

		return results;

	});

	let details = await page.$$eval(selectKeys['details'], (detailList) => {
		let results = [];
		detailList.forEach((el) => {
			let detailInfo = el.innerText.trim();
			results.push(detailInfo);
		});

		return results;

	});

	let rating = await page.$eval(selectKeys['rating'], (el) => {
		let ratingPercent = el.style.width;
		return window.helpers.convertPercentageString(ratingPercent);

	});


	console.log('rating', rating)

};

let url = 'https://www.famousfootwear.com/en-US/Product/77598-1044727/Nike/Black_Blue/Mens+Flex+Experience+RN+7+X-Wide+Running+Shoe.aspx';

sweepURL(url)
.catch((err) => {
	console.log(err);
}) ;