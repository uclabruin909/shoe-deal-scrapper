const moment = require('moment');
const Utils = require('./utils');

const ShoeModel = require('../model').ShoeModel;

class BaseStoreClass {
	constructor(storeConfig, listSweep, dataSweep) {
		this.itemData = [];
		this.config = storeConfig;

		this.itemListSweep = listSweep;
		this.itemDataSweep = dataSweep;	
	}

	getDataCollection() {
		var self = this;
		return self.itemData;
	}

	addCollection(itemData) {
		var self = this;
		self.itemData = [...self.itemData, ...itemData];
	}

	addItem(item) {
		var self = this;
		self.itemData.push(item);
	}

	clearData() {
		var self = this;
		self.itemData = [];
	}

	saveAllDataToDB(cb) {
		var self = this;
		let data = self.getDataCollection();
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

	async sweepItemListFromUrls(urlList, defaultProps) {
		var self = this;
		let defaultPropsMap = defaultProps ? Utils.normalizeDefaultObj(defaultProps) : {};
		console.log(defaultPropsMap);
		let itemCollection = [];
		for (let url of urlList) {
			let items = await self.itemListSweep(url, defaultPropsMap);
			itemCollection = [...itemCollection, ...items];
		}
		return itemCollection;			
	}

	async sweepAllItemListPages() {
		var self = this;
		let itemListPages = self.config.itemListPages;
		for (let pageObj of itemListPages) {
			let pageCategory = pageObj['category'];
			let categoryListResults = await self.sweepItemListFromUrls(pageObj['urlList'], {category: pageCategory});
			self.addCollection(categoryListResults);
		}

		let dataCollection = self.getDataCollection()
		console.log(dataCollection);	
	}	


}

module.exports = BaseStoreClass;

