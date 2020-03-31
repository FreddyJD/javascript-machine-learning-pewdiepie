require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const Twitter = require('twitter');
const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
let cachedDb = null;


function connectToDatabase (uri) {
  console.log('=> connect to database');
  if (cachedDb) {

    console.log('=> using cached database instance');

    return Promise.resolve(cachedDb);

  }
  return MongoClient.connect(uri)

    .then(db => {

      cachedDb = db;

      return cachedDb;

    });

}

module.exports.handler = () => {
  connectToDatabase(process.env.MONGOURI).then(async db => { 
    let collection = db.collection('tweets');
    // get the tweet 
    const tweet = await collection.findOne({tweeted: false});
    await collection.update({ _id: tweet._id}, {$set: {tweeted: true}});

    // tweet it
    await client.post('statuses/update', {status: tweet.tweet});
    return {}; 
    
  })
}
