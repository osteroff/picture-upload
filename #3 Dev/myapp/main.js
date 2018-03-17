const express = require('express');
const path = require('path');
const app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
// routing setting
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res){
    res.render('home');
})

app.get('/home', function(req, res){
    res.render('home');
});

app.get('/work', function(req, res){
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    console.log(longitude, latitude);
    res.render('work', {latitude:latitude, longitude:longitude});
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/contact', function(req, res){
    res.render('contact');
});

app.get('/loc', function(req, res){
    res.render('location');
});

// port setting
app.listen(3000, function () {
    console.log('Connected 3000 port!');
});