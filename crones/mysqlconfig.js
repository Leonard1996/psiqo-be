const mysql = require('mysql2');

function createConnection(host, user, database, password) {
  return mysql.createConnection({
    host,
    user,
    database,
    password,
  });
}

exports.createConnection = createConnection



