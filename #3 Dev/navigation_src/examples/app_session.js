var express = require('express');
var session = require('express-session');

var app = express();

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
app.listen(3003, function() {
  console.log('Connected 3003 port!');
});
