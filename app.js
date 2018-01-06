const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const h2p = require('html2plaintext')

const baseURL = 'http://search.azlyrics.com'

function search(query){
    let url = baseURL + '/search.php?q=' + qs.escape(query);

    request(url, function(err, res, body){
        if(!err){
            $ = cheerio.load(body);

            $('td.text-left a').each(function(){
                url = $(this).attr('href');

                // Get Lyrics
                lyrics(url);

                // Break From Each Loop
                return false; 
            });
        }
        else{
            console.log('Error : ', err);
        }
    });
}

function lyrics(url){
    console.log('Getting lyrics from: ', url);

    request(url, {ciphers: 'DES-CBC3-SHA'}, function(err, res, body){
        if(!err){
            $ = cheerio.load(body);

            $('div:not([class])').each(function(){
                var lyrics = h2p($(this).html()); 
                if(lyrics != ''){
                    updateMessage(lyrics);
                    return false;
                }
            });
        }
        else{
            console.log('Error in Getting Lyrics : ', err);
        }
    });
}

function updateMessage(lyrics){
    console.log('Lyrics : \n', lyrics);

    message = { 'text' : lyrics }
}

search("Shape of You");