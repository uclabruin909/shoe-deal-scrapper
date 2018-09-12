const itemListSweep = require('./sweep/itemListSweep');
const itemDataSweep = require('./sweep/itemDataSweep');
const config = require('./sweep/config/swpConfig.json');
const moment = require('moment');
const Utils = require('../utils');

const ShoeModel = require('../../model').ShoeModel;

class FamousFootwear {
	constructor() {
		this.itemData = [];
		this.itemListSweep = {
			staticSweep: itemListSweep.staticSweep,
		};

		this.itemDataSweep = {
			dynamicSweep: itemDataSweep.dynamicSweep,
			staticSweep: itemDataSweep.staticSweep,
		};		
	}

	addCollection(itemData) {
		this.itemData = [...this.itemData, itemData];
	}

	addItem(item) {
		this.itemData.push(item);
	}

	clearData() {
		this.itemData = [];
	}

	saveCollectionToDB(itemData, cb) {
		ShoeModel.insertMany(itemData)
		.then((items) => {
			if (cb) {
				cb(items);
			}
			console.log('Items have been saved in the database');
		})
		.catch((err) => {
			console.log('ERROR: while saving collection:', err);
		});		
	}

	saveItemsToJSON(itemData, name="") {
		let basePath = __dirname + config.writePath;
		let today = moment().format('YYYY.MM.DD');
		let fileName = name.length > 0 ? `${today}-${config.store}-${name}` : `${today}-${config.store}-ALL`;
		let fileType = '.json';

		let filePath = basePath + fileName + fileType;

		Utils.writeJSONFile(filePath, itemData, function(err) {
			if (err) {
				console.log(`ERROR: writing ${fileName}:`, err);
			}
			console.log(`JSON File: ${fileName} has been sucessfully written`);
		});		
	}

	async sweepItemListFromUrls(urlList, defaultProps) {

		let defaultPropsMap = defaultProps || {};
		let itemCollection = [];
		for (let url of urlList) {
			let items = await this.itemListSweep.staticSweep(url, defaultPropsMap);
			itemCollection = [...itemCollection, ...items];
		}
		return itemCollection;			
	}


}

module.exports = new FamousFootwear();

