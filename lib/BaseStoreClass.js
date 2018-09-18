const moment = require('moment');
const Utils = require('./utils');

const ShoeModel = require('../model').ShoeModel;

class BaseStoreClass {
	constructor(listSweep, dataSweep) {
		this.itemData = [];

		this.itemListSweep = listSweep;
		this.itemDataSweep = dataSweep;	
	}

	getDataCollection() {
		return this.itemData;
	}

	addCollection(itemData) {
		this.itemData = [...this.itemData, ...itemData];
	}

	addItem(item) {
		this.itemData.push(item);
	}

	clearData() {
		this.itemData = [];
	}

	saveAllDataToDB(cb) {
		let data = this.getDataCollection();
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

		let defaultPropsMap = defaultProps ? Utils.normalizeDefaultObj(defaultProps) : {};
		console.log(defaultPropsMap);
		let itemCollection = [];
		for (let url of urlList) {
			let items = await this.itemListSweep(url, defaultPropsMap);
			itemCollection = [...itemCollection, ...items];
		}
		return itemCollection;			
	}


}

module.exports = BaseStoreClass;

