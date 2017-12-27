require('dotenv').config();

// Dependancies
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// client.messages.create(
//   {
//     to: process.env.MY_PHONE_NUMBER,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     body: "This is a test!",
//   },
//   (err, message) => {
//     console.log(message.sid);
//     console.log('It worked!');
//   }
// );

const endPoint = 'https://www.target.com/p/brass-library-task-lamp-hearth-hand-153-with-magnolia/-/A-52677414';


const targetPriceSelector = '#js-product-sr-id > div:nth-child(1) > span:nth-child(1)';
 
const getPrice = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
  
    await page.goto(endPoint);
    await page.waitFor(targetPriceSelector);
  
    const price = await page.evaluate((targetPriceSelector) => {
        const priceSpan = document.querySelector(targetPriceSelector);
        // returned data must be valid JSON        
      return priceSpan.innerHTML;
    }, targetPriceSelector);
  
    await browser.close();
    return price;
  };

  const logPrice = async () => {
    const newPrice = await getPrice();
    console.log(newPrice);
    console.log('💩');
  }

logPrice();



//This is where I place the link/url to the product I'd like to track
// const endPoint = 'https://www.target.com/p/plaid-tree-skirt-green-hearth-hand-153-with-magnolia/-/A-52586856#lnk=sametab';



// fetch(endPoint)
//     .then(function(res) {
//         return res.text();
//     }).then(function(body) {
//         loadCheerio(body);
//         // console.log(body);
//     });


// fetch(endPoint)
//     .then(data => console.log(data));

// function loadCheerio(htmlToLoad) {
//   const $ = cheerio.load(htmlToLoad);
//   const title = $('#js-pdpChatURL').text();
//   console.log(title);
//   console.log('This worked');
// }