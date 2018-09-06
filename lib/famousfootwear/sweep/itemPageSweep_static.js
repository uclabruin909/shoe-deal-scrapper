const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utils = require('../../utils');

const db = require('../../../db');
const ShoeModel = require('../../../model/shoe');

const sweepConfig = require('./config/sweepConfig.json');

let pagesToSweep = sweepConfig.pages;


//pass in url of item page
let sweepURL = async (url) => {
	let response = await axios.get(url);
	let $ = cheerio.load(response.data);	
};













