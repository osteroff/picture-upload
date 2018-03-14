var http=require('http'),
    https = require('https'),
    express = require('express'),
     fs = require('fs');

var options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};


var port1 = 80;
var port2 = 443;

var app = express();

var orientDB = require('orientjs');

var server = orientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '1324803'
});

var db = server.use('kumoh-guide');
var sql = 'select from restaurant';

app.use(express.urlencoded());
app.use(express.static('src/javascript'));

app.set('view engine', 'jade');
app.set('views', './templates');

http.createServer(app).listen(port1, function(){
  console.log("Http server listening on port " + port1);
});


https.createServer(options, app).listen(port2, function(){
  console.log("Https server listening on port " + port2);
});

app.get('/', function (req, res) {
  db.query(sql).then(function(restaurantList) {
    console.log(restaurantList);
    res.render('home', {restaurants: restaurantList});
  })
  // res.render('home');
});

app.get('/work', function(req, res) {
  console.log("Working!");
  var startLongitude = req.query.startLongitude;
  var startLatitude = req.query.startLatitude;
  var destLongitude = req.query.destLongitude;
  var destLatitude = req.query.destLatitude;

  // res.send(startLongitude + "," + startLatitude + "," + destLongitude + "," + destLatitude);
  res.render('work', {startLongitude:startLongitude, startLatitude:startLatitude, destLongitude:destLongitude, destLatitude:destLatitude});
})
