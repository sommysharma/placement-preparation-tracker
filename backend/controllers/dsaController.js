const fs = require("fs");
const path = require("path");

const db = require("../config/db");

const getProblems = (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../data/problems.json"
    );

    const data = fs.readFileSync(
      filePath,
      "utf-8"
    );

    const problems = JSON.parse(data);

    res.status(200).json(problems);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to load DSA problems"
    });
  }
};

const getProgress = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT problem_id, status
    FROM user_dsa_progress
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch progress"
      });
    }

    res.status(200).json(results);
  });
};

const markSolved = (req, res) => {
  const {
    user_id,
    problem_id
  } = req.body;

  const sql = `
    INSERT INTO user_dsa_progress
    (user_id, problem_id, status)
    VALUES (?, ?, 'Solved')
    ON DUPLICATE KEY UPDATE
    status = 'Solved',
    solved_at = CURRENT_TIMESTAMP
  `;

  db.query(
    sql,
    [user_id, problem_id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to update progress"
        });
      }

      res.status(200).json({
        message: "Problem marked as solved"
      });
    }
  );
};

module.exports = {
  getProblems,
  getProgress,
  markSolved
};