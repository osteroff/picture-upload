var orientDB = require('orientjs');

var server = orientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '1324803'
});

var db = server.use('kumoh-guide');
db.record.get('#20:0').then(function(record) {
  console.log('Loaded record: ', record);
})

// SELECT
var sql = 'SELECT FROM restaurant';
db.query(sql).then(function(results) {
  console.log(results);
});

var sql = 'select from restaurant where @rid=:rid';
var param = {
  params:{
    rid:'#20:0'
  }
};

db.query(sql, param).then(function(result) {
  console.log(result);
});

// INSERT
// var sql = "insert into restaurant (name, longitude, latitude) values(:name, :longitude, :latitude)";
// var param = {
//   params: {
//     name: "다미가",
//     longitude: "128.626117",
//     latitude: "35.863182"
//   }
// };
//
// db.query(sql, param).then(function(result) {
//   console.log(result);
// });

// UPDATE
var sql = "update restaurant set name=:name where @rid=:rid";
db.query(sql, {params: {name:"", rid:"#20:0"}}).then(function(result) {
  console.log(result);
});

var sql = "update restaurant set name=:name where @rid=:rid";
db.query(sql, {params: {name:"수성양곱창", rid:"#20:0"}}).then(function(result) {
  console.log(result);
});

// DELETE
var = sql = "delete from restaurant where @rid=:rid";
db.query(sql, {params: {rid: "#20:0"}}).then(function(result) {
  console.log(result);
});

// server.close()
