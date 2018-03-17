var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password"); // 암호화를 여러번 하는 키 스트레칭 등 복잡한 암호화를 간편하게 해주는 모듈
var hasher = bkfd2Password();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var http=require('http'),
    https = require('https'),
    express = require('express'),
     fs = require('fs');

var options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};

var app = express();

var port1 = 80;
var port2 = 443;

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1324803',
  database : 'remember_travel_db'
});

// var orientDB = require('orientjs');
//
// var server = orientDB({
//   host: 'localhost',
//   port: 2424,
//   username: 'root',
//   password: '1324803'
// });

// var db = server.use('kumoh-guide');

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
  // var sql = 'select from tour';
  // db.query(sql).then(function(tourList) {
  //   console.log(tourList);
  //   res.render('home', {tourList: tourList});
  // })

  // var sql = 'select * from tour';
  // conn.query(sql, function (error, tourList, fields) {
  //   if (error) {
  //     console.log(err);
  //   }
  //   else {
  //     res.render('home', {tourList: tourList});
  //   }
  // });
  console.log('location!');
  res.render('location');
  // res.render('home');
});

app.get('/home', function(req, res) {
  var html = `
    <form action='/login' method='post'>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    <a href="/register">회원 가입</a>
  `
});

app.get('/register', function(req, res) {

});
// app.get('/location', function(req, res) {
//   var longitude = req.query.longitude;
//   var latitude = req.query.latitude;
//
//   var sql = 'select * from tour';
//   conn.query(sql, function (error, tourList, fields) {
//     if (error) {
//       console.log(err);
//     }
//     else {
//       tourList.sort(function(a, b) {
//         // console.log('run');
//         var long = parseFloat(longitude);
//         var lat = parseFloat(latitude);
//         var distanceA = (long - a.longitude) * (long - a.longitude) + (lat - a.latitude) * (lat - a.latitude);
//         var distanceB = (longitude - b.longitude) * (longitude - b.longitude) + (lat - b.latitude) * (lat - b.latitude);
//         console.log(distanceA, distanceB);
//         console.log(longitude, latitude);
//         console.log(a.longitude, a.latitude);
//         console.log(b.longitude, b.latitude)
//         // return distanceA - distanceB;
//         return distanceA - distanceB;
//       });
//       res.render('home', {tourList: tourList, longitude: longitude, latitude: latitude});
//     }
//   });
// });
app.get('/work', function(req, res) {
  console.log("Working!");
  var startLongitude = req.query.startLongitude;
  var startLatitude = req.query.startLatitude;
  var destLongitude = req.query.destLongitude;
  var destLatitude = req.query.destLatitude;

  // res.send(startLongitude + "," + startLatitude + "," + destLongitude + "," + destLatitude);
  res.render('work', {startLongitude:startLongitude, startLatitude:startLatitude, destLongitude:destLongitude, destLatitude:destLatitude});
})
