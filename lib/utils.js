const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');

//function to launch puppeteer browser with proper configs/args
//pass in whether to launch as headless or not.  default to false
exports.launchBrowser = function(isHeadless=false) {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];

    const options = {
        args,
        headless: isHeadless,
        ignoreHTTPSErrors: true,
        userDataDir: './tmp',
    };

    return puppeteer.launch(options);    	
}

//function to have puppeteer pages mimic actual user browser
exports.preparePageForTests = async function(page) {
  let self = this;
  // Pass the User-Agent Test.
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  await page.setUserAgent(userAgent);

  // Pass the Webdriver Test.
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Pass the Chrome Test.
  await page.evaluateOnNewDocument(() => {
    // We can mock this in as much depth as we need for the test.
    window.navigator.chrome = {
      runtime: {},
      // etc.
    };

    //also attach helper function into window to use in context
    window.helpers = {
      //method to remove percentage symbols in string and convert to number
      convertPercentageString: function(str) {
        let newStr = str.replace(/[%]/g, '');
        return parseFloat(newStr);  
      },

      hasBaseURL: function(ref) {
        let regEx = /(http\:|https\:)/g;
        return regEx.test(ref);
      },
      removeBackSpaceChar: function(str) {
        return str.replace('/[\\]/g', '');
      },
      extractPriceFromString: function(str) {
        let regEx = /[1-9][0-9]*(?:\.[0-9]{2})?|\\$0?\\.[0-9][0-9]/g;
        let matched = str.match(regEx);
        
        if (matched) {
          return matched[0];    
        }        
      },
      extractSizeFromString: function(str) {
        let regEx = /[-+]?[0-9]*\.?[0-9]+/g;
        let matched = str.match(regEx);

        if (matched) {
          return matched[0];    
        }
      },
      convertToFloatNumber: function(str) {
        return parseFloat(str);      
      } 
    };


  });

  // Pass the Permissions Test.
  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query;
    return window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
  });

  // Pass the Plugins Length Test.
  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, 'plugins', {
      // This just needs to have `length > 0` for the current test,
      // but we could mock the plugins too if necessary.
      get: () => [1, 2, 3, 4, 5],
    });
  });

  // Pass the Languages Test.
  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
}


//gets the BaseURL for the page
//must pass instance of Puppeteer page.
exports.getPageBaseURL = async function(page) {
	let baseURL = await page.evaluate(() => {
		let protocol = window.location.protocol;
		let host = window.location.host;
		return `${protocol}//${host}`;	
	});

	return baseURL;	
}

//remove backspace character from string
exports.removeBackSpaceChar = function(str) {
  return str.replace('/[\\]/g', '');
}

//determines if url/href has baseURL (with protocol and host)
exports.hasBaseURL = function(ref) {
  let regEx = /(http\:|https\:)/g;
  return regEx.test(ref);
}

//a helper method to have file system write JSON file.
exports.writeJSONFile = function(filePath, obj, options, callback) {
  if (typeof callback === 'undefined') {
    let callback = options;
    jsonfile.writeFile(filePath, obj, callback);
  } else {
    jsonfile.writeFile(filePath, obj, options, callback);
  }
  
}

//a helper method to extract numberic value of price from string
exports.extractPriceFromString = function(str) {
  let regEx = /[1-9][0-9]*(?:\.[0-9]{2})?|\\$0?\\.[0-9][0-9]/g;
  let matched = str.match(regEx);
  
  if (matched) {
    return matched[0];    
  }

}

//a helper method to extract numeric value of shoe size from string
exports.extractSizeFromString = function(str) {
  let regEx = /[-+]?[0-9]*\.?[0-9]+/g;
  let matched = str.match(regEx);

  if (matched) {
    return matched[0];    
  }
}

//method to parse string into numbers
exports.convertToFloatNumber = function(str) {
  return parseFloat(str);   
}

//method to remove percentage symbols in string and convert to number
exports.convertPercentageString = function(str) {
  let newStr = str.replace(/[%]/g, '');
  return parseFloat(newStr);   
}

//helper function setTimeout inside async functions
exports.wait = function(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};


//helper function to normalize default object to be compliant with schema
exports.normalizeDefaultObj = function(obj) {
  let schemaKeys = ["name", "brand", "site", "category", "href", "colors", "origPrice", "curPrice", "imgSrc", "availSize", "details", "rating", "createdDate", "isComplete"];

  for (let key in obj) {
    if (schemaKeys.indexOf(key) < 0) {
      delete obj[key];
    }
  }

  return obj;
};