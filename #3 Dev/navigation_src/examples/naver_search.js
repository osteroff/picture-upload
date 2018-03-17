// 네이버 검색 api

var express = require('express');
var cheerio = require("cheerio");
var app = express();

var client_id = 'AQAk6IrZ_v9wyKKQEIv9';
var client_secret = '3zxLMnoOFJ';

app.set('view engine', 'jade');
app.set('views', 'templates');

app.get('/search/blog', function (req, res) {
   var api_url = 'https://openapi.naver.com/v1/search/blog?display=100&query=' + encodeURI(req.query.query); // json 결과
//   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
   var request = require('request');
   var options = {
       url: api_url,
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {

       // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});

       var json = JSON.parse(body);
       var restaurantList = json['items'];
       var length = restaurantList.length;

       for (var i = 0; i < length; ++i)
       {

         var url = restaurantList[i].link;
         request.get(url, function(error, response, body) {
           if (!error && response.statusCode == 200) {
              // console.log(2);
              // var $ = cheerio.load(body);
              //
              // var divElements = $("div.se_caption_group.is-contact");
              //
              // divElements.each(function() {
              //   console.log(3);
              //   var data = $(this).find("a.se_map_link __se_link").attr("data-linkdata");
              //   console.log(data);
              // });
              // var idx = body.indexOf("se_caption_group is-contact"); // frameset 밑에 원하는 html이 있어서 다른 방법이 필요할듯...
              console.log(body);
           }
         });
       }
       // restaurantList = [{"title":"수성다미가", "link":"naver.com"}];
       // var length = restaurantList.length;
       // var jsonArr = [];
       // for (var i = 0; i < length; ++i)
       // {
       //   jsonArr.push(restaurantList[i]);
       // }
       // console.log(restaurantList);
       // console.log(restaurantList.length);
       // console.log(jsonArr);

       res.render('search', {restaurants: restaurantList});

       // res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
 });
 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/search/blog?query=검색어 app listening on port 3000!');
 });
