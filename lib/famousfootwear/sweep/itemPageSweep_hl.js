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

	console.log('availSizes', availSizes);

};

let url = 'https://www.famousfootwear.com/en-US/Product/77598-1044727/Nike/Black_Blue/Mens+Flex+Experience+RN+7+X-Wide+Running+Shoe.aspx';

sweepURL(url)
.catch((err) => {
	console.log(err);
}) ;