const mongoose = require('mongoose');

let ShoeSchema = new mongoose.Schema({
	name: { type: String, default: '' },
	brand: { type: String, default: '' },
	site: { type: String, default: '' },
	category: { type: String, default: '' },
	href: { type: String, default: '' },
	color: { type: String, default: '' },
	origPrice: { type: Number, default: 0 },
	curPrice: { type: Number, default: 0 },
	imgSrc: { type: String, default: '' },
	availSize: { type: Array, default: [] },
	details: { type: Array, default: [] },
	rating: { type: Number, default: 0 },
	updatedDate: { type: Date, default: new Date().now },

});

let ShoeModel = mongoose.model('Shoe', ShoeSchema);

module.exports = ShoeModel;