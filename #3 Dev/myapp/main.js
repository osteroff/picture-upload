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
    res.render('work');
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/contact', function(req, res){
    res.render('contact');
});

// port setting
app.listen(3000, function () {
    console.log('Connected 3000 port!');
});