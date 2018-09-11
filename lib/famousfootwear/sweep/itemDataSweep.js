const axios = require('axios');
const cheerio = require('cheerio');
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



let testURL = 'https://www.famousfootwear.com/en-US/Product/75679-1042745/Crocs/Light+Grey_Slate+Gre/Mens+Convertible+Slip-On.aspx';

let testObj = {
	href: testURL,
	site: 'Famous Footwear', 
	category: 'Sandals',
}

staticSweep(testObj)
.then((result) => {
	console.log(result);
});








