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

	let colors = $(selectorMap['colors']).text().toLowerCase().trim().split('/');

	let rating = $(selectorMap['rating']).css('width');
	rating = Utils.convertPercentageString(rating);

	let availSizeItems = $(selectorMap['availSize']);
	availSizeItems.each(function(ind, elem) {
		let availSizeText = $(this).text().trim();
		let size = Utils.convertToFloatNumber(availSizeText);
		availSize.push(size);
	});

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
		colors: colors,
		rating: rating,
		availSize: availSize,
		details: details,
		...itemObj

	};
	

};



let dynamicSweep = async (itemObj) => {
	

};



exports.staticSweep = staticSweep;
exports.dynamicSweep = dynamicSweep;


//test
staticSweep({href: 'https://www.macys.com/shop/product/levis-mens-turner-nappa-low-top-sneakers?ID=5697210&tdp=cm_app~zMCOM-NAVAPP~xcm_zone~zPDP_ZONE_A~xcm_choiceId~zcidM05MDU-7f561685-3ecf-49ee-829a-f416df67f65d%40H7%40customers%2Balso%2Bshopped%2465%245697210~xcm_pos~zPos2~xcm_srcCatID~z65&mltPDP=true'});




