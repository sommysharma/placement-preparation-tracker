const express = require("express");

const {
  getProblems,
  getProgress,
  markSolved
} = require("../controllers/dsaController");

const router = express.Router();

router.get("/problems", getProblems);

router.get("/progress/:userId", getProgress);

router.post("/progress", markSolved);

module.exports = router;