



// Dependancies
const cheerio = require('cheerio');
require('dotenv').config()





// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages.create(
  {
    to: process.env.MY_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: "This is a test!",
  },
  (err, message) => {
    console.log(message.sid);
    console.log('It worked!');
  }
);



//This is where I place the link/url to the product I'd like to track
const endPoint = 'https://www.target.com/p/plaid-tree-skirt-green-hearth-hand-153-with-magnolia/-/A-52586856#lnk=sametab';


// fetch(endPoint)
//     .then(data => console.log(data));

 