const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const Utils = require('../../utils');

const sweepConfig = require('./config/swpConfig.json');
const selectorMap = sweepConfig.item_dataSweep.selectorMap;


//itemObj = {href, etc}
let staticSweep = async (itemObj) => {
	let url = itemObj.href;
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);

	let availSize = [];
	let details = [];

	//all elements selection specified in sweepConfig.json
	let shoeName = $(selectorMap['name']).text().trim();
	shoeName = Utils.removeBackSpaceChar(shoeName);

	let origPrice = $(selectorMap['origPrice']).text().trim();
	origPrice =	Utils.extractPriceFromString(origPrice);
	origPrice = Utils.convertToFloatNumber(origPrice);

	let curPrice = $(selectorMap['curPrice']).text().trim();
	curPrice =	Utils.extractPriceFromString(curPrice);
	curPrice = Utils.convertToFloatNumber(curPrice);

	let imgSrc = $(selectorMap['imgSrc']).attr('src');
	if (!Utils.hasBaseURL(imgSrc)) {
		let baseURL = sweepConfig.baseURL;
		imgSrc = `${baseURL}${imgSrc}`;
	}		

	//iterate through all size options and extract size value
	// TODO: not working.  Options might be dynamically generated.  Might need to use HL scrapping
	let availSize_select = $(selectorMap['availSize']);
	let availSize_options = availSize_select.children();

	//iterate through all detail list items and extract description
	let detailItems = $(selectorMap['details']);
	detailItems.each(function(ind, elem) {
		let detailText = $(this).text().trim();
		details.push(detailText);
	});		

	let result = {
		name: shoeName,
		origPrice: origPrice,
		curPrice: curPrice,
		imgSrc: imgSrc,
		availSize: availSize,
		details: details,
		...itemObj

	};
	return result;	
};


let dynamicSweep = async (itemObj) => {
	const browser = await Utils.launchBrowser();	
	let url = itemObj.href;

	//configure page instance
	const page = await browser.newPage();
	await Utils.preparePageForTests(page);
	await page.setViewport({ width: 1480, height: 1000 });

	//direct page to url and wait 
	//until  size dropdown options are avail to ensure page fully loaded
	await page.goto(url, {waitUntil: 'networkidle2'});
	await page.waitForSelector(selectorMap['availSize']);

	//values returned
	let shoeName,
	origPrice,
	curPrice,
	imgSrc,
	availSizes,
	details,
	rating;


	shoeName = await page.$eval(selectorMap['name'], (el) => {
		let name = el.innerText.trim();
		return window.helpers.removeBackSpaceChar(name);

	});

	origPrice = await page.$eval(selectorMap['origPrice'], (el) => {
		let price = el.innerText.trim();
		price = window.helpers.extractPriceFromString(price);
		// convert to float number
		return window.helpers.convertToFloatNumber(price);

	});

	curPrice = await page.$eval(selectorMap['curPrice'], (el) => {
		let price = el.innerText.trim();
		price = window.helpers.extractPriceFromString(price);
		// convert to float number
		return window.helpers.convertToFloatNumber(price);

	});

	imgSrc = await page.$eval(selectorMap['imgSrc'], (el) => {
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

	availSizes = await page.$$eval(selectorMap['availSize'], (elements) => {
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

	details = await page.$$eval(selectorMap['details'], (detailList) => {
		let results = [];
		detailList.forEach((el) => {
			let detailInfo = el.innerText.trim();
			results.push(detailInfo);
		});

		return results;

	});

	rating = await page.$eval(selectorMap['rating'], (el) => {
		let ratingPercent = el.style.width;
		return window.helpers.convertPercentageString(ratingPercent);

	});

	let result = {
		name: shoeName,
		origPrice: origPrice,
		curPrice: curPrice,
		imgSrc: imgSrc,
		availSizes: availSizes,
		details: details,
		rating: rating,
		...itemObj,
	};

	return result;			

};


let testURL = 'https://www.famousfootwear.com/en-US/Product/75679-1042745/Crocs/Light+Grey_Slate+Gre/Mens+Convertible+Slip-On.aspx';

let testObj = {
	href: testURL,
	site: 'Famous Footwear', 
	category: 'Sandals',
}

dynamicSweep(testObj)
.then((result) => {
	console.log(result);
});








