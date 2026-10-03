const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(
      path.join(__dirname, "../certs/ca.pem")
    )
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err.message);
    return;
  }

  console.log("Database Connected");
  connection.release();
});

module.exports = db;