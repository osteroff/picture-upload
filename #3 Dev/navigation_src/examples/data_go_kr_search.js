// 공공 데이터 포털 api 이용
var express = require('express');
var app = express();

var request = require('request');
var xml2js = require('xml2js');

var orientDB = require('orientjs');

var server = orientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '1324803'
});

var parser = new xml2js.Parser();

var db = server.use('kumoh-guide');

// var sql = "delete vertex from tour where @rid=:rid";
// db.query(sql, {params: {rid: "#22:0"}}).then(function(result) {
//   console.log(result);
// });
//
// var sql = "delete vertex from tour where @rid=:rid";
// db.query(sql, {params: {rid: "#23:0"}}).then(function(result) {
//   console.log(result);
// });

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e10; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

app.get('/search', function(req, res) {
  var location = req.query.location;

  var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=c3fVn%2FL4ldZkp2wkXUGsqT0gSHgAxx8BpceBMPZMoRs%2F%2B1mwW%2BreiAw6ShnDbduqxBWSJD8uTaX5%2BmIR07oRqg%3D%3D'; /* Service Key*/
  queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('sample'); /* 서비스명 */
  queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /* AND(안드로이드),IOS,ETC(web) */
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지번호 */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('500'); /* 표출건수 */
  queryParams += '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(location); /* 강원(UTF-8인코딩) */
  queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('B'); /* A=제목순,B=인기순,C=최근수정순,D=등록순 */

  request({
      url: url + queryParams,
      method: 'GET'
  }, function (error, response, body) {
      //console.log('Status', response.statusCode);
      //console.log('Headers', JSON.stringify(response.headers));
      console.log('Reponse received', body);
      parser.parseString(body, function(err, result) {
        // console.log(result);
        var data = result.response.body[0].items[0].item;
        console.log(result);
        console.log(data);
        var length = data.length;
        var destinationHTML = "";

        for (var i = 0; i < length; ++i)
        {
          var cat2 = data[i].cat2;
          // 카테고리가 관광지, 문화시설일 경우
          if ('A0101' <= cat2 && cat2 <= 'A0206')
          {
            var title = data[i].title[0];

            // set data
            var longitude = parseFloat(data[i].mapx);
            var latitude = parseFloat(data[i].mapy);
            if (data[i].firstimage2)
              var image = data[i].firstimage2[0];
            if (data[i].tel)
              var tel = data[i].tel[0];
            if (data[i].addr1)
              var addr = data[i].addr1[0];



            // append resultHTML
            console.log('running');

            destinationHTML += title + '<br>';
            destinationHTML += longitude + '<br>';
            destinationHTML += latitude + '<br>';
            if (tel)
              destinationHTML += tel + '<br>';
            destinationHTML += addr + '<br>';
            destinationHTML += "<img src=" + image + ">";
            destinationHTML += '<br><br>'

            // insert when title didn't exist!
            var selectSQL = "select from tour where title = (:title)";
            var selectParam = {
              params: {
                "title" : title
              }
            };

            var insertSQL = "insert into tour (title, longitude, latitude, image, tel, addr) values(:title, :longitude, :latitude, :image, :tel, :addr)";
            console.log(title); // 쿼리 문을 DB에 날린 후 DB가 결과문을 반환할 때 쯤에는 이미 for문이 끝까지 돌아가서 title이 변경되있다.
            // set sql param
            var insertParam = {
              params: {
                "title": title,
                "longitude": longitude,
                "latitude": latitude,
                "image": image,
                "tel": tel,
                "addr" : addr
              }
            };

            db.query(insertSQL, insertParam).then(function(result) {
              console.log(result);
            });

            // console.log(title);
            // db.query(selectSQL, selectParam).then(function(results) {
            //   console.log(results);
            //   console.log(results.length);
            //   if (results.length == 0) {
            //     // insert sql
            //     var insertSQL = "insert into tour (title, longitude, latitude, image, tel, addr) values(:title, :longitude, :latitude, :image, :tel, :addr)";
            //     console.log(title); // 쿼리 문을 DB에 날린 후 DB가 결과문을 반환할 때 쯤에는 이미 for문이 끝까지 돌아가서 title이 변경되있다.
            //     // set sql param
            //     var insertParam = {
            //       params: {
            //         "title": title,
            //         "longitude": longitude,
            //         "latitude": latitude,
            //         "image": image,
            //         "tel": tel,
            //         "addr" : addr
            //       }
            //     };
            //
            //     // db.query(insertSQL, insertParam).then(function(result) {
            //     //   console.log(result);
            //     // });
            //   }
            // });

            // sleep(1000);
          } // end category if
        }
        console.log(destinationHTML);
        res.send(destinationHTML);
        // res.send(data);

      });
  });
});

app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/search?query=검색어 app listening on port 3000!');
});
