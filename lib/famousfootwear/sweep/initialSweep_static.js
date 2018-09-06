const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utils = require('../../utils');

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
			//if href is missing baseURL/protocol, manually added it
			if (!Utils.hasBaseURL(href)) {
				let baseURL = sweepConfig.baseURL;
				href = `${baseURL}${href}`;
			}
			let shoeData = {
				href: href,
				brand: Utils.removeBackSpaceChar(brand),
				category: category,
				company: company,
			};

			shoeDataCollection.push(shoeData);
		});			
	}

	return shoeDataCollection;
};

//pass in array of 'page' objects defined in sweepConfig.json
let sweepAllPages = async (pages) => {
	let shoeDataCollection = [];

	for (let page of pages) {
		let sweepResult = await sweepPage(page);
		shoeDataCollection = [...shoeDataCollection, ...sweepResult];
	}
	return shoeDataCollection;
};

let writeJSONFile = async (result) => {
	let rootPath = sweepConfig.fileWrite.path;
	let todayDate = moment().format('YYYY.MM.DD');
	let companyName = sweepConfig.store;

	let filePath = `${rootPath}${todayDate}-${companyName}.json`;

	Utils.writeJSONFile(filePath, result, {spaces: 4}, function(err) {
		if (!err) {
			console.log('JSON File has been written: ', filePath);
		}
		else {
			console.log('Error has occured when writing JSON file:', err);
			return err;
		}
	});

};


sweepAllPages(pagesToSweep)
.then(async (result) => {
	await writeJSONFile(result);
});











