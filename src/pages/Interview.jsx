import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Interview.css";
function Interview() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [setup, setSetup] = useState({
    topic: "JavaScript",
    difficulty: "Medium",
    company_type: "Product",
    package_range: "5-10"
  });

  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setSetup((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function startInterview() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/mock-interviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user.id,
            ...setup
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to start interview");
        return;
      }

      const newInterviewId = data.interviewId;

      setInterviewId(newInterviewId);

      const generateResponse = await fetch(
        `http://localhost:5000/api/mock-interviews/${newInterviewId}/generate-questions`,
        {
          method: "POST"
        }
      );

      const generateData = await generateResponse.json();

      if (!generateResponse.ok) {
        setMessage(
          generateData.message ||
            "Failed to generate questions"
        );
        return;
      }

      const questionResponse = await fetch(
        `http://localhost:5000/api/mock-interviews/${newInterviewId}/questions`
      );

      const questionData = await questionResponse.json();

      if (!questionResponse.ok) {
        setMessage("Failed to load questions");
        return;
      }

      if (questionData.length !== 10) {
        setMessage(
          `Expected 10 questions but received ${questionData.length}`
        );
        return;
      }

      setQuestions(questionData);
      setCurrentIndex(0);
      setAnswer("");

    } catch (error) {
      console.log(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function submitCurrentAnswer() {
    if (!answer.trim()) {
      setMessage("Please enter an answer");
      return;
    }

    if (!currentQuestion) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const questionId = currentQuestion.id;

      const answerResponse = await fetch(
        `http://localhost:5000/api/mock-interviews/questions/${questionId}/answer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            answer,
            answer_type: "text"
          })
        }
      );

      const answerData = await answerResponse.json();

      if (!answerResponse.ok) {
        setMessage(
          answerData.message ||
            "Failed to submit answer"
        );
        return;
      }

      const evaluationResponse = await fetch(
        `http://localhost:5000/api/mock-interviews/questions/${questionId}/evaluate`,
        {
          method: "POST"
        }
      );

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        setMessage(
          evaluationData.message ||
            "AI evaluation failed"
        );
        return;
      }

      const feedback = evaluationData.feedback || "";

      const scoreMatch = feedback.match(
        /Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i
      );

      const score = scoreMatch
        ? Number(scoreMatch[1])
        : 0;

      const isCorrect = score >= 5;

      const saveResponse = await fetch(
        `http://localhost:5000/api/mock-interviews/questions/${questionId}/evaluation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ai_score: score,
            ai_feedback: feedback,
            is_correct: isCorrect
          })
        }
      );

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        setMessage(
          saveData.message ||
            "Failed to save evaluation"
        );
        return;
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
      } else {
        const completeResponse = await fetch(
          `http://localhost:5000/api/mock-interviews/${interviewId}/complete`,
          {
            method: "POST"
          }
        );

        const completeData = await completeResponse.json();

        if (!completeResponse.ok) {
          setMessage(
            completeData.message ||
              "Failed to complete interview"
          );
          return;
        }

        navigate(
          `/interview/report/${interviewId}`
        );
      }

    } catch (error) {
      console.log(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="interview-page">
        <div className="interview-setup">
          <h1>Mock Interview</h1>

          <p>
            Complete a 10-question AI-powered
            technical interview.
          </p>

          <label>Topic</label>

          <select
            name="topic"
            value={setup.topic}
            onChange={handleChange}
          >
            <option value="JavaScript">
              JavaScript
            </option>

            <option value="React">
              React
            </option>

            <option value="SQL">
              SQL
            </option>

            <option value="DSA">
              DSA
            </option>

            <option value="DBMS">
              DBMS
            </option>

            <option value="OOP">
              OOP
            </option>
          </select>

          <label>Difficulty</label>

          <select
            name="difficulty"
            value={setup.difficulty}
            onChange={handleChange}
          >
            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>
          </select>

          <label>Company Type</label>

          <select
            name="company_type"
            value={setup.company_type}
            onChange={handleChange}
          >
            <option value="Service">
              Service
            </option>

            <option value="Product">
              Product
            </option>
          </select>

          <label>Package</label>

          <select
            name="package_range"
            value={setup.package_range}
            onChange={handleChange}
          >
            <option value="Under 5">
              Under 5 LPA
            </option>

            <option value="5-10">
              5–10 LPA
            </option>

            <option value="Above 10">
              Above 10 LPA
            </option>
          </select>

          <button
            onClick={startInterview}
            disabled={loading}
          >
            {loading
              ? "Generating Interview..."
              : "Start Interview"}
          </button>

          {message && (
            <p className="interview-message">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="interview-page">
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="interview-container">

        <div className="interview-header">
          <span>
            Question {currentIndex + 1} / 10
          </span>

          <span>
            {setup.topic} · {setup.difficulty}
          </span>
        </div>

        <div className="interview-progress">
          <div
            className="interview-progress-bar"
            style={{
              width: `${
                ((currentIndex + 1) / 10) * 100
              }%`
            }}
          />
        </div>

        <div className="interview-question-card">

          <h2>
            {currentQuestion.question}
          </h2>

          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            placeholder="Write your answer here..."
            rows="10"
            disabled={loading}
          />

          <button
            onClick={submitCurrentAnswer}
            disabled={loading}
          >
            {loading
              ? "AI Evaluating..."
              : currentIndex === 9
                ? "Finish Interview"
                : "Submit & Next"}
          </button>

          {message && (
            <p className="interview-message">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Interview;