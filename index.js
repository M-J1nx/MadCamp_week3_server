var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'tj11021223',
  database : 'madcampweek3'  
});
 
connection.connect();
 
connection.query('SELECT * from user', function (error, results, fields) {
  if (error) throw error;
  console.log('users: ', results);
});
 
connection.end();