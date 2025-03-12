const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createPool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
  host: process.env.HOST,
  connectionLimit: 100,
  enableKeepAlive: true,
  keepAliveInitialDelay: 3 * 1000,
  maxIdle: 0,
  queueLimit: 0,
});

connection.getConnection((err, data) => {
  if (err) {
    console.log("Can't connect to the database.");
  }

  connection.query("SELECT * FROM tb_results", (err, data) => {
    console.log(data);
  });

  console.log("Connected to the database.");
});

module.exports = connection;
