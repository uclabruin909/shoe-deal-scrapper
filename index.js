const FamousFootwear = require('./lib/famousfootwear');
const Utils = require('./lib/utils.js');
// const db = require('./db/index.js');
// const ShoeModel = require('./model/shoe.js');

var page1 = {
	url: 'https://www.famousfootwear.com/en-US/Mens/_/_/Athletic+Shoes/On+Sale/Products.aspx',
	category: 'Sandals',
	site: 'Finishline'
};

var page2 = {
	url: 'https://www.famousfootwear.com/en-US/Mens/_/_/Athletic+Shoes~Fashion+Sneakers/On+Sale/Products.aspx',
	category: 'Comfort',
	site: 'Finishline'
};

var urlList = [page1.url, page2.url];

let getItemListFromUrls = async (urlList, defaultProps) => {
	let defaultPropsMap = defaultProps || {};
	let itemCollection = [];
	for (let url of urlList) {
		let items = await FamousFootwear.itemListSweep.staticSweep(url, defaultPropsMap);
		itemCollection = [...itemCollection, ...items];
	}
	return itemCollection;	
}

let saveItemsToJSON = async (itemCollection) => {
	let path = __dirname + '/data/';
	let fileName = '2018.09.11-test';
	let fileType = '.json';
	let filePath = path + fileName + fileType;

	console.log('About to write JSON file');
	await Utils.wait(5000);
	console.log('5 seconds has passed');

	Utils.writeJSONFile(filePath, itemCollection, function(err) {
		console.log('Wrote file');
		if (err) {
			console.log('Error writing JSON file');
		}
	});
}

let saveItemsToDB = async (itemCollection) => {
	return ShoeModel.insertMany(itemCollection)
		.then((items) => {
			console.log('Items have been saved');
		})
		.catch((err) => {
			console.log('ERROR WHILE SAVING:', err);
		});
};

let getIncompleteData = async () => {

}; 


getItemListFromUrls(urlList)
.then(saveItemsToJSON);