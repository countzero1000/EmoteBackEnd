let SERVER_URL = 'http://localhost:8080/'
let HEROKU = 'https://emotebackend.herokuapp.com/';
let fs = require('fs')
let FormData = require('form-data')
let axios = require('axios');
let blob =  fs.readFileSync('happy.jpeg');


var request = require('request');

var options = {
  'method': 'POST',
  'url': HEROKU  + 'processFrame',
  'headers': {
    'Content-Type': ['application/x-www-form-urlencoded', 'image/jpeg']
  },
  body: blob

};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});