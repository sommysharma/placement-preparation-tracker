const mysql = require("mysql2");

const sqlPracticeDb = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Abhi1980.",
  database: "sql_practice"
});

sqlPracticeDb.connect((err) => {
  if (err) {
    console.log(
      "SQL Practice database connection failed:",
      err.message
    );
    return;
  }

  console.log("SQL Practice Database Connected");
});

module.exports = sqlPracticeDb;