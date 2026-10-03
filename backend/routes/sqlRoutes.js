const express = require("express");

const {
  getQuestions,
  getProgress,
  markSolved,
  runQuery
} = require("../controllers/sqlController");

const router = express.Router();

router.get("/questions", getQuestions);

router.get("/progress/:userId", getProgress);

router.post("/progress", markSolved);

router.post("/run", runQuery);

module.exports = router;