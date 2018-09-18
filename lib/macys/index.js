const BaseStoreClass = require('../BaseStoreClass');
const itemListSweep = require('./sweep/itemListSweep');
const itemDataSweep = require('./sweep/itemDataSweep');
const config = require('./sweep/config/swpConfig.json');
const moment = require('moment');
const Utils = require('../utils');


class MacysStore extends BaseStoreClass{
	constructor() {
		super(config, itemListSweep.staticSweep, itemDataSweep.staticSweep);
	}

}

let newMacyStore = new MacysStore(); 

newMacyStore.sweepAllItemListPages();

module.exports = newMacyStore;

