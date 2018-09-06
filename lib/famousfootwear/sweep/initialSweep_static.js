const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../../../db');
const ShoeModel = require('../../../model/shoe');

const sweepConfig = require('./config/sweepConfig.json');

let pagesToSweep = sweepConfig.pages;


//pass in 'page' object defined in sweepConfig.json
let sweepPage = async (page) => {
	let url_entries = page.entries;
	let category = page.category;
	let company = sweepConfig.store;

	let shoeDataCollection = [];

	for (let url of url_entries) {
		//load and init cheerio parser
		let response = await axios.get(url);
		let $ = cheerio.load(response.data);

		//select the target el with the selector configured in sweepConfig.json
		let targetEls = $(page.initSweep.targetEl);

		targetEls.each(function(ind, elem) {
			let href = $(this).find(page.initSweep.selectKeys['href']).attr('href');
			let brand = $(this).find(page.initSweep.selectKeys['brand']).text().trim();
			let shoeData = {
				href: href,
				brand: brand,
				category: category,
				company: company,
			};

			shoeDataCollection.push(shoeData);
		});			
	}

	return shoeDataCollection;
};

let sweepAllPages = async (pages) => {
	let shoeDataCollection = [];

	for (let page of pages) {
		let sweepResult = await sweepPage(page);
		shoeDataCollection = [...shoeDataCollection, ...sweepResult];
	}
	return shoeDataCollection;
};

sweepAllPages(pagesToSweep)
.then((result) => {
	console.log('result has been passed!', result);
})







