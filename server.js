const express = require('express');
const server = express();
const request = require('request');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

//Setup the server properties to use index.ejs
//and also use the static files within public ie. styles.css
server.use(express.static('public'));
server.use(bodyParser.urlencoded({extended: true}));
server.set('view engine', 'ejs');

let apiKey = keys.openWeather.key;
//Get the temp back in Kelvin and will have to convert
const KELVIN = 273;

server.get('/', function (req, res) {
    res.render('index')
});

server.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body)
            if(weather.main == undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
});

server.listen(3000, function () {
    console.log('Example server listening on port 3000!')
});