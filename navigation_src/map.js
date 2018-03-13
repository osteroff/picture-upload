var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', './templates');

app.get('/map', function(req, res) {
  res.render('map');
});

app.get('/', function(req, res) {
  res.send('Hello!');
})

app.get('/loc', function(req, res) {
  res.render('location');
});

app.listen(3000, function() {
  console.log('Connecting 3000 port!')
});
