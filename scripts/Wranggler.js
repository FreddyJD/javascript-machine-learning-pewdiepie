const csv = require('csv-parser')
const fs = require('fs')
const results = [];
 
fs.createReadStream('./tweets_csv.csv')
  .pipe(csv())
  .on('data', (data) => {
      
     // Tried my best to clean this up with regex
     let cleanedTweet = data.Tweets.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
     cleanedTweet = cleanedTweet.replace(/(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)/g, '');

     // filter duplicated tweets
      if(!results.includes(cleanedTweet)) {
        results.push(cleanedTweet)
      }
    }
   ).on('end', () => {
     // write the raw tweets
      let writer = fs.createWriteStream('./raw_tweets.txt');
      writer.write(results.join('\n'));
  });