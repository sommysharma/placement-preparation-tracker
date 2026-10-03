const db = require("../config/db");
const ai = require("../config/gemini");

const createInterview = (req, res) => {
  const {
    user_id,
    topic,
    difficulty,
    company_type,
    package_range
  } = req.body;

  if (
    !user_id ||
    !topic ||
    !difficulty ||
    !company_type ||
    !package_range
  ) {
    return res.status(400).json({
      message: "All interview details are required"
    });
  }

  const sql = `
    INSERT INTO mock_interviews
    (
      user_id,
      topic,
      difficulty,
      company_type,
      package_range,
      total_questions
    )
    VALUES (?, ?, ?, ?, ?, 10)
  `;

  db.query(
    sql,
    [
      user_id,
      topic,
      difficulty,
      company_type,
      package_range
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to create interview"
        });
      }

      res.status(201).json({
        message: "Interview created successfully",
        interviewId: result.insertId
      });
    }
  );
};

const getInterviews = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT *
    FROM mock_interviews
    WHERE user_id = ?
    ORDER BY started_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch interviews"
      });
    }

    res.status(200).json(results);
  });
};

const getInterview = (req, res) => {
  const interviewId = req.params.id;

  const sql = `
    SELECT *
    FROM mock_interviews
    WHERE id = ?
  `;

  db.query(sql, [interviewId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch interview"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    res.status(200).json(results[0]);
  });
};

const addQuestion = (req, res) => {
  const interviewId = req.params.id;

  const {
    question_number,
    question,
    answer_type
  } = req.body;

  if (!question_number || !question) {
    return res.status(400).json({
      message: "Question number and question are required"
    });
  }

  const sql = `
    INSERT INTO mock_interview_questions
    (
      interview_id,
      question_number,
      question,
      answer_type
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      interviewId,
      question_number,
      question,
      answer_type || "text"
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to add question"
        });
      }

      res.status(201).json({
        message: "Question added successfully",
        questionId: result.insertId
      });
    }
  );
};

const getQuestions = (req, res) => {
  const interviewId = req.params.id;

  const sql = `
    SELECT *
    FROM mock_interview_questions
    WHERE interview_id = ?
    ORDER BY question_number ASC
  `;

  db.query(sql, [interviewId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch questions"
      });
    }

    res.status(200).json(results);
  });
};

const submitAnswer = (req, res) => {
  const questionId = req.params.id;

  const {
    answer,
    answer_type
  } = req.body;

  if (!answer) {
    return res.status(400).json({
      message: "Answer is required"
    });
  }

  const sql = `
    UPDATE mock_interview_questions
    SET
      answer = ?,
      answer_type = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      answer,
      answer_type || "text",
      questionId
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to submit answer"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Question not found"
        });
      }

      res.status(200).json({
        message: "Answer submitted successfully"
      });
    }
  );
};

const evaluateAnswer = async (req, res) => {
  const questionId = req.params.id;

  const sql = `
    SELECT
      id,
      question,
      answer,
      answer_type
    FROM mock_interview_questions
    WHERE id = ?
  `;

  db.query(sql, [questionId], async (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch answer"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    const questionData = results[0];

    if (!questionData.answer) {
      return res.status(400).json({
        message: "Answer has not been submitted"
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `
You are a technical interviewer evaluating a candidate.

Question:
${questionData.question}

Candidate Answer:
${questionData.answer}

Evaluate the answer based on:
1. Correctness
2. Technical accuracy
3. Completeness
4. Clarity

Give the result in this format:

Score: X/10
Correctness: ...
Technical Accuracy: ...
Completeness: ...
Clarity: ...
Feedback: ...
Improvement: ...
`
      });

      const aiFeedback = response.text;

      res.status(200).json({
        message: "Answer evaluated successfully",
        feedback: aiFeedback
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Gemini API failed",
        error: error.message
      });
    }
  });
};

const saveEvaluation = (req, res) => {
  const questionId = req.params.id;

  const {
    ai_score,
    ai_feedback,
    is_correct
  } = req.body;

  if (
    ai_score === undefined ||
    !ai_feedback
  ) {
    return res.status(400).json({
      message: "Score and feedback are required"
    });
  }

  const sql = `
    UPDATE mock_interview_questions
    SET
      ai_score = ?,
      ai_feedback = ?,
      is_correct = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      ai_score,
      ai_feedback,
      is_correct || false,
      questionId
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to save evaluation"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Question not found"
        });
      }

      res.status(200).json({
        message: "Evaluation saved successfully"
      });
    }
  );
};

const testGemini = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Say hello in one sentence."
    });

    res.status(200).json({
      message: response.text
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gemini API failed",
      error: error.message
    });
  }
};
const calculateInterviewScore = (req, res) => {
  const interviewId = req.params.id;

  const sql = `
    SELECT
      COUNT(*) AS total_questions,
      COUNT(ai_score) AS evaluated_questions,
      AVG(ai_score) AS average_score,
      SUM(
        CASE
          WHEN is_correct = TRUE THEN 1
          ELSE 0
        END
      ) AS correct_answers
    FROM mock_interview_questions
    WHERE interview_id = ?
  `;

  db.query(sql, [interviewId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to calculate interview score"
      });
    }

    const data = results[0];

    if (data.evaluated_questions === 0) {
      return res.status(400).json({
        message: "No evaluated questions found"
      });
    }

    const score = Number(
      Number(data.average_score).toFixed(2)
    );

    res.status(200).json({
      interviewId,
      totalQuestions: data.total_questions,
      evaluatedQuestions: data.evaluated_questions,
      score,
      correctAnswers: data.correct_answers
    });
  });
};
const completeInterview = (req, res) => {
  const interviewId = req.params.id;

  const scoreSql = `
    SELECT
      COUNT(*) AS total_questions,
      COUNT(ai_score) AS evaluated_questions,
      AVG(ai_score) AS average_score,
      SUM(
        CASE
          WHEN is_correct = TRUE THEN 1
          ELSE 0
        END
      ) AS correct_answers
    FROM mock_interview_questions
    WHERE interview_id = ?
  `;

  db.query(scoreSql, [interviewId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to calculate interview result"
      });
    }

    const data = results[0];

    if (data.evaluated_questions < 10) {
      return res.status(400).json({
        message: "All 10 questions must be evaluated before completing the interview",
        evaluatedQuestions: data.evaluated_questions
      });
    }

    const score = Number(
      Number(data.average_score).toFixed(2)
    );

    const updateSql = `
      UPDATE mock_interviews
      SET
        score = ?,
        correct_answers = ?,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [
        score,
        data.correct_answers || 0,
        interviewId
      ],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.log(updateErr);

          return res.status(500).json({
            message: "Failed to complete interview"
          });
        }

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({
            message: "Interview not found"
          });
        }

        res.status(200).json({
          message: "Interview completed successfully",
          interviewId,
          score,
          totalQuestions: data.total_questions,
          correctAnswers: data.correct_answers || 0
        });
      }
    );
  });
};
const getInterviewReport = (req, res) => {
  const interviewId = req.params.id;

  const interviewSql = `
    SELECT
      id,
      user_id,
      topic,
      difficulty,
      company_type,
      package_range,
      total_questions,
      score,
      correct_answers,
      started_at,
      completed_at
    FROM mock_interviews
    WHERE id = ?
  `;

  db.query(
    interviewSql,
    [interviewId],
    (interviewErr, interviewResults) => {
      if (interviewErr) {
        console.log(interviewErr);

        return res.status(500).json({
          message: "Failed to fetch interview report"
        });
      }

      if (interviewResults.length === 0) {
        return res.status(404).json({
          message: "Interview not found"
        });
      }

      const questionSql = `
        SELECT
          id,
          question_number,
          question,
          answer,
          answer_type,
          ai_score,
          ai_feedback,
          is_correct
        FROM mock_interview_questions
        WHERE interview_id = ?
        ORDER BY question_number ASC
      `;

      db.query(
        questionSql,
        [interviewId],
        (questionErr, questionResults) => {
          if (questionErr) {
            console.log(questionErr);

            return res.status(500).json({
              message: "Failed to fetch interview questions"
            });
          }

          res.status(200).json({
            interview: interviewResults[0],
            questions: questionResults
          });
        }
      );
    }
  );
};
const generateInterviewQuestions = async (req, res) => {
  const interviewId = req.params.id;

  const interviewSql = `
    SELECT
      topic,
      difficulty,
      company_type,
      package_range
    FROM mock_interviews
    WHERE id = ?
  `;

  db.query(
    interviewSql,
    [interviewId],
    async (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to fetch interview details"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Interview not found"
        });
      }

      const interview = results[0];

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `
Generate exactly 10 technical interview questions.

Topic: ${interview.topic}
Difficulty: ${interview.difficulty}
Company Type: ${interview.company_type}
Package Range: ${interview.package_range}

Requirements:
- Generate exactly 10 questions.
- Questions must be suitable for a technical interview.
- Match the requested difficulty.
- Do not provide answers.
- Do not number the questions.
- Return only the questions.
- Put each question on a separate line.
`
        });

        const text = response.text;

        const questions = text
          .split("\n")
          .map((question) =>
            question
              .replace(/^\d+[\).\s-]*/, "")
              .trim()
          )
          .filter((question) => question.length > 0)
          .slice(0, 10);

        if (questions.length !== 10) {
          return res.status(500).json({
            message: "Gemini did not generate exactly 10 questions",
            generated: questions.length
          });
        }

        const insertSql = `
          INSERT INTO mock_interview_questions
          (
            interview_id,
            question_number,
            question,
            answer_type
          )
          VALUES ?
        `;

        const values = questions.map((question, index) => [
          interviewId,
          index + 1,
          question,
          "text"
        ]);

        db.query(
          insertSql,
          [values],
          (insertErr) => {
            if (insertErr) {
              console.log(insertErr);

              return res.status(500).json({
                message: "Failed to save generated questions"
              });
            }

            res.status(201).json({
              message: "10 questions generated successfully",
              questions
            });
          }
        );

      } catch (error) {
        console.log(error);

        res.status(500).json({
          message: "Gemini question generation failed",
          error: error.message
        });
      }
    }
  );
};
module.exports = {
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
};