const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const Utils = require('../../utils');

const sweepConfig = require('./config/swpConfig.json');
const selectorMap = sweepConfig.item_dataSweep.selectorMap;


//itemObj = {href, etc}
let staticSweep = async (itemObj) => {

};


let dynamicSweep = async (itemObj) => {
	

};



exports.staticSweep = staticSweep;
exports.dynamicSweep = dynamicSweep;







