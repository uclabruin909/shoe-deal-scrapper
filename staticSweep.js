const axios = require('axios');
const cheerio = require('cheerio');

let base_url = 'https://www.shoes.com/discount-mens-sandals.htm?display=3x32';
let hrefs = [];

axios.get(base_url).then((response) => {
	let $ = cheerio.load(response.data);
	let productLinks = $('.pt_info a');
	productLinks.each(function(ind, elem) {
		let ref = $(this).attr('href');
		hrefs.push(ref);		
	});

	console.log(hrefs);

});

