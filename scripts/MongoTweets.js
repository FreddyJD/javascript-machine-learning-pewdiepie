require('dotenv').config();

const fs = require('fs')
const results = [];
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGOURI;
const duplicatedWords = [
    'indiegogocomprojectspewdiepies25millionbrosstrongcharitydriveforsavethechildren',
    'postingbecausepeopleaskedwhenIwasgoingtodoit',
    'youtubecom',
    'pictwittercom',
]


MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    fs.readFile('./results/alltweets.txt', 'utf8', function (err, data) {
        if (err) throw err;
        data = data.split('====================');
        data.map(i => {
            i = i.replace(/\n/g, '');
            bannedWords = checkForDuplicatedWords(i);
            duplicatedTweets = checkForDuplicatedTweets(i)
            if (bannedWords === false && duplicatedTweets === false) {
                results.push({
                    tweet: i,
                    tweeted: false
                })
            }
        });
        // insert the tweets in our mongodb db
        db.collection("tweets").insertMany(results, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });

    // A little ghetto non-perfomant check.
    function checkForDuplicatedWords(val) {
        let duplicated = false;
        duplicatedWords.map(word => {
            if (val.includes(word)) {
                duplicated = true;
            }
        });
        return duplicated;
    }

    function checkForDuplicatedTweets(val) {
        let duplicated = false;
        results.map(word => {
            if (val.includes(word)) {
                duplicated = true;
            }
        });
        return duplicated;
    }



}); 













   