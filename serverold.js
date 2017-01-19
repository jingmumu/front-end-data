var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var urls=require('./allurl.js');
//console.log(urls);
var queryN=urls.length;

var result=[];

for(var spiderIndex=0;spiderIndex<queryN;spiderIndex++){
    url = urls[spiderIndex].substring(0,35);
    app.get('/scrape', function(req, res){
            request(url, function(error, response, html){
                if(!error){
                    var $ = cheerio.load(html);

                    var title, release, rating;
                    var json = { title : "", release : "", rating : ""};

                    $('.title_wrapper').filter(function(){
                        var data = $(this);
                        title = data.children().first().text();            
                        release = $('#titleYear').children().first().text();

                        json.title = title;
                        json.release = release;
                    })

                    $('.ratingValue').filter(function(){
                        var data = $(this);
                        rating = data.children().first().text();

                        json.rating = rating;
                    })  
                }
                result.push(json);
                save(result); 

                res.send('Check your console!')
            })
    })
}

function save(ds){
    fs.writeFile('output.json', JSON.stringify(ds, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            })
    }

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;