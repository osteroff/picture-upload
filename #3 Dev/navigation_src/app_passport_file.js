var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var md5 = require('md5');   // 암호화 모듈
var sha = require('sha256');  // md5는 이제 잘 안쓰는 대신 sha256을 많이 쓴다고 한다.
var bkfd2Password = require("pbkdf2-password"); // 암호화를 여러번 하는 키 스트레칭 등 복잡한 암호화를 간편하게 해주는 모듈
var hasher = bkfd2Password();
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({extended: false}));

app.use(session( {
  secret: 'afdsffjeklwrjql#!@#@!#!@',  // 암호화
  resave: false,  // sesion id를 접속할때 새롭게 발급하지 않는다.
  saveUninitialized: true // session id를 세션을 실제로 사용하기 전까지는 발급하지 말라
}));

app.use(passport.initialize());
app.use(passport.session()); // 세션 사용후 코드를 놔두어야 한다.

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

app.get('/auth/register', function(req, res) {
  var output = `
    <h1>Register<h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  res.send(output);
});

var users = [];
app.post('/auth/register', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.displayName);

  hasher({password:req.body.displayName}, function(err, pass, salt, hash) {
      console.log(hash);
      var user = {
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.displayName
      };
      users.push(user);
      console.log(users);
      req.login(user, function(err) {
        req.session.save(function() {
          res.redirect('/welcome');
        });
      });
  });

  // using md5
  // var user = {
  //   username: req.body.username,
  //   password: md5(req.body.password),
  //   displayName: req.body.displayName
  // };
  // users.push(user);
  // console.log(users);
  // req.session.displayName = req.body.displayName;
  // res.redirect("/welcome");
});

// done에서 전달된 user값
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.username); // donw을 호출할 때 사용자에 대한 식별자를 2번째 인자로 준다. 그러면 세션에 사용자 식별자가 저장된다.
});

passport.deserializeUser(function(id, done) { // 그 다음 사용자가 페이지를 이동할 때 마다 해당 함수가 실행된다. serializeUser에서 등록된 식별자가 id로 들어온다.
  console.log('deserializeUser', id)
  for (var i= 0; i < users.length; ++i)
  {
    var user = users[i];
    if (user.username === id) {
      done(null, user);  // session에 user라는 객체 등록
    }
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;
    // console.log(uname, pwd, user.username, user.password);
    console.log(users);
    for (var i = 0; i < users.length; ++i) {
      var user = users[i];
      console.log(uname, pwd);
      console.log(user.username, user.password);
      if (uname === user.username) {
        return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash) {  // hasher가 시작되면서 return을 줌으로써 for문이 실행되지 않도록 한다.
          if (hash === user.password) {
            console.log('LocalStrategy', user);
            done(null, user);   // login 절차 설공, user가 false가 아니라면 serializeUser가 실행된다.
            // req.session.displayName = user.displayName;
            // req.session.save(function() {
            //   res.redirect('/welcome');
            // })
          } else {
            done(null, false);  // 로그인 에러 발생으로 2번째 인자에 false값을 준다. 첫번째 인자에는 프로세스 동작 도중 에러가 발생했을 경우 준다.
            // res.send('Who are you? <a href="/auth/login">login</a>');
          }
        });
      }
    }
    done(null, false);
  }
)); // 구체적인 인증 전략

app.post('/auth/login', passport.authenticate( // 미들 웨어가 함수를 만들어줌
  'local',    // passport 전략 중 local이 실행된다.
  { successRedirect: '/welcome',
    failureRedirect: '/auth/login',
    failureFlash: false }) // done에서 던진 인증 메시지를 준다.
);
// app.post('/auth/login', function(req, res) {
//   // var user = {
//   //   username:'egoing',
//   //   password:'1111',
//   //   displayName: 'Egoing'
//   // };
//   var uname = req.body.username;
//   var pwd = req.body.password;
//   // console.log(uname, pwd, user.username, user.password);
//   console.log(users);
//   for (var i = 0; i < users.length; ++i) {
//     var user = users[i];
//     console.log(uname, pwd);
//     console.log(user.username, user.password);
//     if (uname === user.username) {
//       return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash) {  // hasher가 시작되면서 return을 줌으로써 for문이 실행되지 않도록 한다.
//         if (hash === user.password) {
//           req.session.displayName = user.displayName;
//           req.session.save(function() {
//             res.redirect('/welcome');
//           })
//         } else {
//           res.send('Who are you? <a href="/auth/login">login</a>');
//         }
//       });
//     }
//
//     // using md5
//     // if (uname === user.username && md5(pwd) === user.password) {
//     //   req.session.displayName = user.displayName;
//     //   return req.session.save(function() {  // session이 종료되고, session에 저장이 완료되면
//     //     res.redirect('/welcome');
//     //   });
//     // }
//   }
//   res.send('Who are you? <a href="/auth/login">login</a>');
// });

app.get('/auth/logout', function(req, res) {
  // delete req.session.displayName;
  req.logout();   // passport의 기능으로 session에 있는 데이터 제거
  req.session.save(function() { // 세션 정보 수정이 완료되면
    res.redirect('/welcome');
  });
})

app.get('/welcome', function(req, res) {
  console.log(req.session);
  if (req.user && req.session.displayName)  // passport는 request 객체에 user라는 것이 소속되게 만들어준다.
    res.send(`Hello! ${req.session.displayName} <br><a href="/auth/logout">Logout</a>`);
  else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a><br>
      <a href="/auth/register">Register</a>`);
  }
})

app.listen(3003, function() {
  console.log('Connected 3003 port!');
});
