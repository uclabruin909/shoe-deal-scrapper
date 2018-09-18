const BaseStoreClass = require('../BaseStoreClass');
const itemListSweep = require('./sweep/itemListSweep');
const itemDataSweep = require('./sweep/itemDataSweep');
const config = require('./sweep/config/swpConfig.json');
const moment = require('moment');
const Utils = require('../utils');

class FamousFootwearStore extends BaseStoreClass{
	constructor() {
		super(itemListSweep.staticSweep, itemDataSweep.staticSweep);
	}

	async sweepAllItemListPages() {
		let itemListPages = config.itemListPages;
		for (let pageObj of itemListPages) {
			let pageCategory = pageObj['category'];
			let categoryListResults = await this.sweepItemListFromUrls(pageObj['urlList'], {category: pageCategory});
			this.addCollection(categoryListResults);
		}

		let dataCollection = this.getDataCollection()
		console.log(dataCollection);	
	}		

}

let newFamousFootwearStore = new FamousFootwearStore(); 

newMacyStore.sweepAllItemListPages();

module.exports = newFamousFootwearStore;

