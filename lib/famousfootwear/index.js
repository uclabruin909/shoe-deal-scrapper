const itemListSweep = require('./sweep/itemListSweep');
const itemDataSweep = require('./sweep/itemDataSweep');
// const config = require('./sweep/config/swpConfig.json');

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

	addCollection(itemArray) {
		this.itemData = [...this.itemData, itemArray];
	}

	addItem(item) {
		this.itemData.push;
	}

	clearData() {
		this.itemData = [];
	}
}

module.exports = new FamousFootwear();