const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utils = require('../../utils');

const db = require('../../../db');
const ShoeModel = require('../../../model/shoe');

const sweepConfig = require('./config/sweepConfig.json');

let pagesToSweep = sweepConfig.pages;


//pass in url of item page
let sweepURL = async (url) => {
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);

	let availSize = [];
	let details = [];

	//all elements selection specified in sweepConfig.json
	let shoeName = $(sweepConfig.itemSweep.selectKeys['name']).text().trim();
	shoeName = Utils.removeBackSpaceChar(shoeName);	
	let origPrice = $(sweepConfig.itemSweep.selectKeys['origPrice']).text().trim();
	origPrice =	Utils.extractPriceFromString(origPrice);
	let curPrice = $(sweepConfig.itemSweep.selectKeys['curPrice']).text().trim();
	curPrice =	Utils.extractPriceFromString(curPrice);
	let imgSrc = $(sweepConfig.itemSweep.selectKeys['imgSrc']).attr('src');	

	//iterate through all size options and extract size value
	// TODO: not working.  Options might be dynamically generated.  Might need to use HL scrapping
	let availSize_select = $(sweepConfig.itemSweep.selectKeys['availSize']);
	let availSize_options = availSize_select.children();

	//iterate through all detail list items and extract description
	let detailItems = $(sweepConfig.itemSweep.selectKeys['details']);
	console.log(detailItems);
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

	};
	console.log(result);	
};



let url = 'https://www.famousfootwear.com/en-US/Product/75679-1042745/Crocs/Light+Grey_Slate+Gre/Mens+Convertible+Slip-On.aspx';

sweepURL(url)
.then(() => {
	console.log('done!');
});








