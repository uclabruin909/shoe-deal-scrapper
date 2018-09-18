const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utils = require('../../utils');

const sweepConfig = require('./config/swpConfig.json');
const selectorMap = sweepConfig.item_listSweep.selectorMap;


let staticSweep = async (url, defaultProps) => {
	let itemCollection = [];
	let defaultPropMap = defaultProps || {};
	let site = sweepConfig.store;
	let todayDate = moment().format('YYYY.MM.DD');

	//load and init cheerio parser
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);

	let productItemEls = $(selectorMap.targetEl);
	
	productItemEls.each(function(ind, elem) {
		let href = $(this).find(selectorMap['href']).attr('href');

		//if href is missing baseURL/protocol, manually added it
		if (!Utils.hasBaseURL(href)) {
			let baseURL = sweepConfig.baseURL;
			href = `${baseURL}${href}`;
		}
		let itemData = {
			href: href,
			site: site,
			createdDate: todayDate,
			...defaultPropMap
		};

		itemCollection.push(itemData);
	});

	console.log(itemCollection);

};

staticSweep('https://www.macys.com/shop/mens-clothing/sale-clearance/Shoe_type/Sneakers?id=43387');

exports.staticSweep = staticSweep;

