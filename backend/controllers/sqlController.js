const fs = require("fs");
const path = require("path");
const sqlPracticeDb = require("../config/sqlPracticeDb");
const db = require("../config/db");

const getQuestions = (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../data/sqlQuestions.json"
    );

    const data = fs.readFileSync(
      filePath,
      "utf-8"
    );

    const questions = JSON.parse(data);

    res.status(200).json(questions);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to load SQL questions"
    });
  }
};

const getProgress = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT question_id, status
    FROM user_sql_progress
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch SQL progress"
      });
    }

    res.status(200).json(results);
  });
};

const markSolved = (req, res) => {
  const { user_id, question_id } = req.body;

  const sql = `
    INSERT INTO user_sql_progress
    (user_id, question_id, status)
    VALUES (?, ?, 'Solved')
    ON DUPLICATE KEY UPDATE
    status = 'Solved',
    solved_at = CURRENT_TIMESTAMP
  `;

  db.query(
    sql,
    [user_id, question_id],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to update SQL progress"
        });
      }

      res.status(200).json({
        message: "Question marked as solved"
      });
    }
  );
};
const runQuery = (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      message: "SQL query is required"
    });
  }

  const cleanQuery = query.trim();

  const firstWord = cleanQuery
    .split(/\s+/)[0]
    .toUpperCase();

  if (firstWord !== "SELECT" && firstWord !== "WITH") {
    return res.status(400).json({
      message: "Only SELECT queries are allowed"
    });
  }

  sqlPracticeDb.query(
    cleanQuery,
    (err, results) => {
      if (err) {
        console.log(err);

        return res.status(400).json({
          message: err.message
        });
      }

      res.status(200).json({
        message: "Query executed successfully",
        results
      });
    }
  );
};
module.exports = {
  getQuestions,
  getProgress,
  markSolved,
  runQuery
};