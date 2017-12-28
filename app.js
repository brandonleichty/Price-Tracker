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

function sendTextMessage(productName, previousPrice, currentPrice) {
    client.messages.create({
            to: process.env.MY_PHONE_NUMBER,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `${productName} has changed from ${previousPrice} to ${currentPrice}.`,
        },
        (err, message) => {
            console.log(message.sid);
            console.log('Message sent!'); //This is just for fun
        }
    );
}


function sendInitialTextMessage(name, price) {
    client.messages.create({
            to: process.env.MY_PHONE_NUMBER,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `${name} is currently ${price}. We'll update you if anything changes. -EVE`,
        },
        (err, message) => {
            console.log(message.sid);
            console.log('Message sent!'); //This is just for fun
        }
    );
}



let initialProductPrice = '$10.99';

const endPoint = 'https://www.target.com/p/stoneware-mug-14oz-hearth-hand-153-with-magnolia/-/A-52991410';


const targetPriceSelector = '#js-product-sr-id > div:nth-child(1) > span:nth-child(1)';
const targetProductNameSelector = '.title-product > span:nth-child(1)';

const scrapeProductInfo = async() => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.goto(endPoint);
    await page.waitFor(targetPriceSelector);

    // get product price
    const price = await page.evaluate((targetPriceSelector) => {
        const priceSpan = document.querySelector(targetPriceSelector);
        return priceSpan.innerHTML.trim();
    }, targetPriceSelector);

    // get product name
    const name = await page.evaluate((targetProductNameSelector) => {
        const nameSpan = document.querySelector(targetProductNameSelector);
        return nameSpan.innerHTML;
    }, targetProductNameSelector);


    await browser.close();
    return {
        price: price,
        name: name
    }; //return object with price and name of product
};

// const logPrice = async() => {
//     const newPrice = await getPrice();
//     console.log(newPrice);
//     console.log('💩');
// }

const checkForPriceChanges = async() => {
    const product = await scrapeProductInfo();

    if(initialProductPrice === null){
        initialProductPrice = product.price;
        sendInitialTextMessage(product.name, product.price);
    } else {
        sendTextMessage(product.name, initialProductPrice, product.price);
        console.log(`The name of the product is ${product.name}, and the price is ${product.price}.`);
    }

    console.log(`${product.price}💩💩💩`);
    console.log(`${initialProductPrice}`);

};

checkForPriceChanges();