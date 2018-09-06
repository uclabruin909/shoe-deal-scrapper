const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./db');
const ShoeModel = require('./model/shoe');

let base_url = 'https://www.shoes.com/discount-mens-sandals.htm?display=3x32';
let hrefs = [];

let sweep = async (url) => {
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);
	let productLinks = $('.pt_info a');

	productLinks.each(function(ind, elem) {
		let ref = $(this).attr('href');
		let newShoe = new ShoeModel({
			href: ref
		});

		newShoe.save()
		.then(() => {
			console.log('Shoe Saved');
		})
		.catch((err) => {
			console.log('Error while saving:', err);
		})

		hrefs.push(ref);		
	});	

};


// axios.get(base_url).then((response) => {
// 	let $ = cheerio.load(response.data);
// 	let productLinks = $('.pt_info a');
// 	productLinks.each(function(ind, elem) {
// 		let ref = $(this).attr('href');
// 		let newShoe = new ShoeModel({
// 			href: ref
// 		});

// 		newShoe.save()
// 		.then(() => {
// 			console.log('Shoe Saved');
// 		})
// 		.catch((err) => {
// 			console.log('Error while saving:', err);
// 		})

// 		hrefs.push(ref);		
// 	});

// 	console.log(hrefs);

// });

sweep(base_url)
.then(() => {
	console.log(hrefs);
})
.catch((err) => {
	console.log(err);
}) ;