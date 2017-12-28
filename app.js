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
            body: 
`${productName} has changed from ${previousPrice} to ${currentPrice}.

-EVE`,
        },
        (err, message) => {
            console.log(message.sid);
            console.log('Message sent!'); //This is just for fun
        }
    );
}



function sendInitialTextMessage(name, price, image) {
    client.messages.create({
            to: process.env.MY_PHONE_NUMBER,
            from: process.env.TWILIO_PHONE_NUMBER,
            mediaUrl: `${image}`,
            body: 
`I've started watching the ${name}. The price is currently $49.99.

I'll update you if there are any changes. 
-EVE`,
        },
        (err, message) => {
            console.log(message.sid);
            console.log('Message sent!'); //This is just for fun
        }
    );
}


let initialProductPrice = '$49.99';

const endPoint = 'https://www.target.com/p/accent-lamp-geometric-figural-wood-threshold-153/-/A-51011683';


const targetPriceSelector = '#js-product-sr-id > div:nth-child(1) > span:nth-child(1)';
const targetProductNameSelector = '.title-product > span:nth-child(1)';
const targetProductImageSelector = '#imagecarousal > div > div.product-image-carousal-holder.tapToZoom.js-tapToZoom.carousel.carousel-container.carousel-vertical-product > ul > div > div > li.lenszoom.slick-slide.slick-active.slick-center > a > img';


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

    // get product image
    const image = await page.evaluate((targetProductImageSelector) => {
        const imageSource = document.querySelector(targetProductImageSelector);
        return imageSource.src;
    }, targetProductImageSelector);


    await browser.close();
    return {
        price: price,
        name: name,
        image: image
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
        sendInitialTextMessage(product.name, product.price, product.image);
    } else {
        sendTextMessage(product.name, initialProductPrice, product.price);
        console.log(`The name of the product is ${product.name}, and the price is ${product.price}.`);
    }

    console.log(`${product.price}💩💩💩`);
    console.log(`${initialProductPrice}`);

};

checkForPriceChanges();