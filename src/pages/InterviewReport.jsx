import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Interview.css";
function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  async function fetchReport() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/mock-interviews/${id}/report`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load report");
        return;
      }

      setReport(data);
    } catch (error) {
      console.log(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="interview-page">
        <p>Loading interview report...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="interview-page">
        <p className="interview-message">{message}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="interview-page">
        <p>No report found.</p>
      </div>
    );
  }

  const { interview, questions } = report;

  return (
    <div className="interview-page">
      <div className="interview-report">

        <div className="report-header">
          <div>
            <h1>Interview Report</h1>

            <p>
              {interview.topic} · {interview.difficulty}
            </p>
          </div>

          <button onClick={() => navigate("/interview")}>
            New Interview
          </button>
        </div>

        <div className="report-summary">

          <div className="report-card">
            <span>Overall Score</span>

            <strong>
              {Number(interview.score || 0).toFixed(1)}/10
            </strong>
          </div>

          <div className="report-card">
            <span>Correct Answers</span>

            <strong>
              {interview.correct_answers || 0}/10
            </strong>
          </div>

          <div className="report-card">
            <span>Questions</span>

            <strong>
              {interview.total_questions}
            </strong>
          </div>

          <div className="report-card">
            <span>Company Type</span>

            <strong>
              {interview.company_type}
            </strong>
          </div>

        </div>

        <div className="report-details">

          <div>
            <span>Topic</span>
            <strong>{interview.topic}</strong>
          </div>

          <div>
            <span>Difficulty</span>
            <strong>{interview.difficulty}</strong>
          </div>

          <div>
            <span>Package</span>
            <strong>{interview.package_range} LPA</strong>
          </div>

        </div>

        <div className="question-results">

          <h2>Question-wise Analysis</h2>

          {questions.map((item) => (
            <div
              className="report-question-card"
              key={item.id}
            >

              <div className="question-top">

                <span>
                  Question {item.question_number}
                </span>

                <strong>
                  {item.ai_score !== null
                    ? `${Number(item.ai_score).toFixed(1)}/10`
                    : "Not Evaluated"}
                </strong>

              </div>

              <h3>{item.question}</h3>

              <div className="answer-section">
                <span>Your Answer</span>

                <p>
                  {item.answer || "No answer provided"}
                </p>
              </div>

              <div className="feedback-section">
                <span>AI Feedback</span>

                <p>
                  {item.ai_feedback ||
                    "No feedback available"}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default InterviewReport;