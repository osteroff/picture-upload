var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(session( {
  secret: 'afdsffjeklwrjql#!@#@!#!@',  // 암호화
  resave: false,  // sesion id를 접속할때 새롭게 발급하지 않는다.
  saveUninitialized: true // session id를 세션을 실제로 사용하기 전까지는 발급하지 말라
}));

app.get('/count', function(req, res) {
  console.log(req.session.count);
  if (req.session.count)
    req.session.count++;
  else
    req.session.count = 1; // count라는 값을 서버에 저장
  res.send(`count : ${req.session.count}`);
})

app.get('/auth/login', function(req, res) {
  var output = `
    <h1>Login</h1>
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
  `;
  res.send(output);
});

app.post('/auth/login', function(req, res) {
  var user = {
    username:'egoing',
    password:'1111',
    displayName: 'Egoing'
  };

  var uname = req.body.username;
  var pwd = req.body.password;
  console.log(uname, pwd, user.username, user.password);
  if (uname === user.username && pwd === user.password) {
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});

app.get('/auth/logout', function(req, res) {
  delete req.session.displayName;
  res.redirect('/welcome');
})

app.get('/welcome', function(req, res) {
  console.log(req.session);
  if (req.session.displayName)
    res.send(`Hello! ${req.session.displayName} <br><a href="/auth/logout">Logout</a>`);
  else {
    res.send('Welcome<a href="/auth/login">Login</a>"');
  }
})

app.listen(3003, function() {
  console.log('Connected 3003 port!');
});
