const wayback = require('wayback-downloader')
const fs = require('fs')

wayback.getTimeMap("https://twitter.com/pewdiepie/", async function(err, data){
  data.mementos.map(wayBackPage => { 
    fs.appendFileSync('./waybacklinks.txt', wayBackPage.url + ' \n ')
  })
})