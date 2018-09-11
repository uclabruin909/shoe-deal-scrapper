const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utils = require('../../utils');

const sweepConfig = require('./config/swpConfig.json');
const selectorMap = sweepConfig.item_listSweep.selectorMap;


let staticSweep = async (url, defaultProps) => {
	let itemCollection = [];
	let defaultPropMap = defaultProps || {};
	let todayDate = moment().format('YYYY.MM.DD');

	//load and init cheerio parser
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);

	//collection of product item elements
	let productItemEls = $(selectorMap.targetEl);

	productItemEls.each(function(ind, elem) {
		let href = $(this).find(selectorMap['href']).attr('href');
		let brand = $(this).find(selectorMap['brand']).text().trim();

		/*TODO: need to determine how to parse different color formats for each site.
		Famous Footwear uses '/'*/
		let colors = $(this).find(selectorMap['colors']).text().trim().split('/');

		//if href is missing baseURL/protocol, manually added it
		if (!Utils.hasBaseURL(href)) {
			let baseURL = sweepConfig.baseURL;
			href = `${baseURL}${href}`;
		}
		let itemData = {
			href: href,
			brand: Utils.removeBackSpaceChar(brand),
			colors: colors,
			createdDate: todayDate,
			...defaultPropMap
		};

		itemCollection.push(itemData);
	});

	return itemCollection;	

};

exports.staticSweep = staticSweep;

// staticSweep('https://www.famousfootwear.com/en-US/Mens/_/_/Athletic+Shoes/On+Sale/Products.aspx')
// .then((results) => {
// 	console.log(results);
// })