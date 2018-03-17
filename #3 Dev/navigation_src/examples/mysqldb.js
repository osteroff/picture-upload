var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1324803',
  database : 'kumoh_guide'
});
connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
//

// insert
var sql = 'insert into tour (title, longitude, latitude, addr) values(?, ?, ?, ?)';
var params = ["한글", 123.123, 123.123, "테스트"];
connection.query(sql, params, function (error, rows, fields) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(rows);
  }
});


// SELECT
var sql = 'select * from tour';
connection.query(sql, function (error, rows, fields) {
  if (error) {
    console.log(err);
  }
  else {
    for (var i=0; i < rows.length; ++i) {
      console.log(rows[i].title);
    }
    console.log('fields', fields);
  }
});



connection.end();
