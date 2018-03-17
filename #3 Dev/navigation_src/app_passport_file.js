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
var FacebookStrategy = require('passport-facebook').Strategy;
var multer = require('multer');
// var upload = multer({dest: 'upload/'});   // 목적지
var upload = multer({storage: 'upload/'});   // 목적지
var _storage = multer.diskStorage();
var fs = require('fs');
app.set('view engine', 'jade');
app.set('views', './templates');

var http=require('http'),
    https = require('https'),
    express = require('express'),
     fs = require('fs');

 var mysql      = require('mysql');
 var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '1324803',
   database : 'remember_travel_db'
 });

 conn.connect();

 var port1 = 80;
 var port2 = 443;

 var options = {
     key: fs.readFileSync('keys/key.pem'),
     cert: fs.readFileSync('keys/cert.pem')
 };

 http.createServer(app).listen(port1, function(){
   console.log("Http server listening on port " + port1);
 });


 https.createServer(options, app).listen(port2, function(){
   console.log("Https server listening on port " + port2);
 });

app.use(bodyParser.urlencoded({extended: false}));

app.use(session( {
  secret: 'afdsffjeklwrjql#!@#@!#!@',  // 암호화
  resave: false,  // sesion id를 접속할때 새롭게 발급하지 않는다.
  saveUninitialized: true // session id를 세션을 실제로 사용하기 전까지는 발급하지 말라
}));

app.use(passport.initialize());
app.use(passport.session()); // 세션 사용후 코드를 놔두어야 한다.

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
    <a href="/auth/facebook">Facebook</a>
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
        <input type="text" name="nickname" placeholder="nickname">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `
  res.send(output);
});

app.post('/auth/register', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.displayName);
  var sql = 'insert into user (username, password, nickname, salt) values(?, ?, ?, ?)';

  hasher({password:req.body.password}, function(err, pass, salt, hash) {
      // console.log(hash);
      var user = {
        username: req.body.username,
        password: hash,
        salt: salt,
        nickname: req.body.nickname
      };
      // users.push(user);
      var params = [req.body.username, hash, req.body.nickname, salt];
      conn.query(sql, params, function (error, rows, fields) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(rows);
          req.login(user, function(err) {
            req.session.save(function() {
              res.redirect('/welcome');
            });
          });
        }
      });
  });
});

app.get(
  '/auth/facebook',
  passport.authenticate( // 미들 웨어가 함수를 만들어줌
  'facebook'    // passport 전략 중 facebook을 쓴다. /auth/facebook 에 들어가면 redirect 시켜준다.
  )
);

app.get(
  '/auth/facebook/callback',  // 페이스북 사이트에 갔다가 사용자가 확인을 누를 경우 서버의 콜백을 호출한다.
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);

// done에서 전달된 user값
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.username); // donw을 호출할 때 사용자에 대한 식별자를 2번째 인자로 준다. 그러면 세션에 사용자 식별자가 저장된다.
});

passport.deserializeUser(function(id, done) { // 그 다음 사용자가 페이지를 이동할 때 마다 해당 함수가 실행된다. serializeUser에서 등록된 식별자가 id로 들어온다.
  console.log('deserializeUser', id);
  var sql = 'select * from user';

  conn.query(sql, function (error, rows, fields) {
    if (error) {
      console.log(err);
    }
    else {
      for (var i=0; i < rows.length; ++i) {
        // console.log(rows[i].username);
        if (rows[i].username === id)
          return done(null, rows[i]);
      }
      console.log('fields', fields);
    }
  });


  // for (var i= 0; i < users.length; ++i)
  // {
  //   var user = users[i];
  //   if (user.username === id) {
  //     done(null, user);  // 서버 req 객체에 user라는 객체 등록
  //   }
  // }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;
    // console.log(uname, pwd, user.username, user.password);
    // console.log(users);
    var sql = 'select * from user';
    conn.query(sql, function (error, rows, fields) {
      if (error) {
        console.log(err);
      }
      else {
        for (var i=0; i < rows.length; ++i) {
          var user = rows[i];
          // console.log(rows[i].username);
          if (rows[i].username === uname) {
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
        console.log('fields', fields);
      }
    });

    // for (var i = 0; i < users.length; ++i) {
    //   var user = users[i];
    //   console.log(uname, pwd);
    //   console.log(user.username, user.password);
    //   if (uname === user.username) {
    //     return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash) {  // hasher가 시작되면서 return을 줌으로써 for문이 실행되지 않도록 한다.
    //       if (hash === user.password) {
    //         console.log('LocalStrategy', user);
    //         done(null, user);   // login 절차 설공, user가 false가 아니라면 serializeUser가 실행된다.
    //         // req.session.displayName = user.displayName;
    //         // req.session.save(function() {
    //         //   res.redirect('/welcome');
    //         // })
    //       } else {
    //         done(null, false);  // 로그인 에러 발생으로 2번째 인자에 false값을 준다. 첫번째 인자에는 프로세스 동작 도중 에러가 발생했을 경우 준다.
    //         // res.send('Who are you? <a href="/auth/login">login</a>');
    //       }
    //     });
    //   }
    // }
    // done(null, false);
  }
)); // 구체적인 인증 전략

passport.use(new FacebookStrategy({
    clientID: "201373493795371",
    clientSecret: "2c80cc493419066de5aca5f759fdfcc1",
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));


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
  console.log(req.user);
  if (req.user && req.user.nickname)  // passport는 request 객체에 user라는 것이 소속되게 만들어준다.
    res.send(`Hello! ${req.user.nickname} <br><a href="/auth/logout">Logout</a>`);
  else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a><br>
      <a href="/auth/register">Register</a>`);
  }
});

app.get('/upload', function(req, res) {
  res.render('upload');
});

app.post('/upload', upload.single('picture'), function(req, res) { // single인자로 file name에 지정된 값을 설정
  console.log(req.file);
  res.send('aa' + req.file);
});

// app.listen(80, function() {
//   console.log('Connected 3003 port!');
// });
