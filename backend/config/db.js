const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhi1980.",
  database: "placement_tracker"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
    return;
  }

  console.log("Database Connected");
});

module.exports = db;