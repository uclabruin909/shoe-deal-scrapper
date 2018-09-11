const db = require('./db/index.js');
const ShoeModel = require('./model/shoe.js');
const FamousFootwear = require('./lib/famousfootwear');

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

var pageList = [page1, page2];

let getItemListFromUrls = async (urlList, defaultProps) => {
	let defaultPropsMap = defaultProps || {};
	let itemCollection = [];
	for (let url of urlList) {
		let items = await FamousFootwear.itemListSweep.staticSweep(page.url, defaultPropsMap);
		itemCollection = [...itemCollection, ...items];
	}
	return itemCollection;	
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


getItemListFromUrls(pageList)
.then(saveItemsToDB);