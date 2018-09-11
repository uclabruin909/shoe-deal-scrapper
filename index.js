// const db = require('./db/index.js');
// const ShoeModel = require('./model/shoe.js');
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

var pageList = [page2];

let getItemsFromPages = async (pageArr) => {
	let itemCollection = [];
	for (let page of pageArr) {
		let defaultProps = {
			category: page.category,
			site: page.site,
		};
		let items = await FamousFootwear.itemListSweep.staticSweep(page.url, defaultProps);
		itemCollection = [...itemCollection, ...items];
	}
	return itemCollection;	
}

let getItemDatafromCollection = async (itemCollection) => {
	let itemObj = itemCollection[0];
	let itemData = await FamousFootwear.itemDataSweep.staticSweep(itemObj);
	console.log(itemData);
} 


getItemsFromPages(pageList)
.then(getItemDatafromCollection);