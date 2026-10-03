const express = require("express");

const {
  createInterview,
  getInterviews,
  getInterview,
  addQuestion,
  getQuestions,
  submitAnswer,
  evaluateAnswer,
  saveEvaluation,
  testGemini,
  calculateInterviewScore,
  completeInterview,
  getInterviewReport,
  generateInterviewQuestions
} = require("../controllers/mockInterviewController");

const router = express.Router();

router.post("/", createInterview);

router.get("/user/:userId", getInterviews);

router.get("/test-ai", testGemini);

router.get("/:id/score", calculateInterviewScore);

router.post("/:id/complete", completeInterview);

router.get("/:id/report", getInterviewReport);
router.post("/:id/generate-questions", generateInterviewQuestions);
router.get("/:id", getInterview);

router.post("/:id/questions", addQuestion);

router.get("/:id/questions", getQuestions);

router.put("/questions/:id/answer", submitAnswer);

router.post("/questions/:id/evaluate", evaluateAnswer);

router.put("/questions/:id/evaluation", saveEvaluation);

module.exports = router;