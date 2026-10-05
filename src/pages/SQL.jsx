import { useEffect, useState } from "react";
import "./SQL.css";

function SQL() {
  const [questions, setQuestions] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState(new Set());

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function loadData() {
      try {
        const questionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/sql/questions`
        );

        const questionsData = await questionsResponse.json();

        if (!questionsResponse.ok) {
          throw new Error(
            questionsData.message || "Failed to load SQL questions"
          );
        }

        setQuestions(questionsData);

        const progressResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/sql/progress/${user.id}`
        );

        const progressData = await progressResponse.json();

        if (!progressResponse.ok) {
          throw new Error(
            progressData.message || "Failed to load progress"
          );
        }

        const solvedIds = new Set(
          progressData.map((item) => item.question_id)
        );

        setSolvedQuestions(solvedIds);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const categories = [
    "All",
    ...new Set(
      questions.map((question) => question.category)
    ),
  ];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      question.category === category;

    const matchesDifficulty =
      difficulty === "All" ||
      question.difficulty === difficulty;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty
    );
  });

  const progress =
    questions.length === 0
      ? 0
      : Math.round(
          (solvedQuestions.size / questions.length) * 100
        );

  async function markSolved(questionId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sql/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            question_id: questionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to mark question as solved");
        return;
      }

      setSolvedQuestions((previous) => {
        const updated = new Set(previous);
        updated.add(questionId);
        return updated;
      });
    } catch (error) {
      console.log(error);
      alert("Failed to update progress");
    }
  }

  async function runQuery() {
    if (!query.trim()) {
      alert("Write a SQL query first");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sql/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setQueryResult({
          type: "error",
          message: data.message || "Query execution failed",
        });

        return;
      }

      setQueryResult({
        type: "success",
        results: data.results || [],
      });
    } catch (error) {
      console.log(error);

      setQueryResult({
        type: "error",
        message: "Server error",
      });
    }
  }

  function handleSolve(question) {
    setSelectedQuestion(question);
    setQuery("");
    setQueryResult(null);
  }

  function closeEditor() {
    setSelectedQuestion(null);
    setQuery("");
    setQueryResult(null);
  }

  function handleMarkSolved() {
    if (!selectedQuestion) {
      return;
    }

    markSolved(selectedQuestion.id);
  }

  if (loading) {
    return (
      <div className="sql-page">
        <h2>Loading SQL questions...</h2>
      </div>
    );
  }

  return (
    <div className="sql-page">
      <div className="sql-header">
        <div>
          <h1>SQL Practice</h1>

          <p>
            Practice SQL questions and improve
            your database skills.
          </p>
        </div>

        <div className="sql-progress">
          <span>{progress}%</span>

          <small>
            {solvedQuestions.size} / {questions.length} Solved
          </small>
        </div>
      </div>

      <div className="sql-controls">
        <div className="sql-search">
          <input
            type="text"
            placeholder="Search SQL questions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value)
          }
        >
          <option value="All">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="sql-count">
        Showing {filteredQuestions.length} questions
      </div>

      <div className="sql-list">
        {filteredQuestions.map((question) => {
          const solved = solvedQuestions.has(question.id);

          return (
            <div
              className={`sql-card ${
                solved ? "sql-card-solved" : ""
              }`}
              key={question.id}
            >
              <div className="sql-card-top">
                <span className="sql-number">
                  #{question.id}
                </span>

                <span className="sql-category">
                  {question.category}
                </span>

                <span className="sql-difficulty">
                  {question.difficulty}
                </span>
              </div>

              <h3>{question.question}</h3>

              <div className="sql-concept">
                Concept: {question.concept}
              </div>

              {solved ? (
                <button
                  className="sql-solved-button"
                  onClick={() => handleSolve(question)}
                >
                  ✓ Solved — Re-attempt
                </button>
              ) : (
                <button
                  className="sql-solve-button"
                  onClick={() => handleSolve(question)}
                >
                  Solve
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedQuestion && (
        <div className="sql-editor-overlay">
          <div className="sql-editor">
            <div className="sql-editor-header">
              <div>
                <span>
                  Question #{selectedQuestion.id}
                </span>

                <h2>{selectedQuestion.question}</h2>

                <div className="sql-editor-concept">
                  Concept: {selectedQuestion.concept}
                </div>
              </div>

              <button
                className="sql-close-button"
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <textarea
              className="sql-textarea"
              placeholder="Write your SQL query here..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />

            <div className="sql-editor-actions">
              <button
                className="sql-run-button"
                onClick={runQuery}
              >
                Run Query
              </button>

              <button
                className="sql-mark-button"
                onClick={handleMarkSolved}
              >
                Mark as Solved
              </button>

              <button
                className="sql-cancel-button"
                onClick={closeEditor}
              >
                Cancel
              </button>
            </div>

            {queryResult && (
              <div className="sql-result">
                {queryResult.type === "error" ? (
                  <div className="sql-error">
                    {queryResult.message}
                  </div>
                ) : (
                  <div>
                    <div className="sql-success">
                      Query executed successfully
                    </div>

                    {queryResult.results.length > 0 ? (
                      <div className="sql-result-table">
                        <table>
                          <thead>
                            <tr>
                              {Object.keys(
                                queryResult.results[0]
                              ).map((column) => (
                                <th key={column}>
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {queryResult.results.map(
                              (row, index) => (
                                <tr key={index}>
                                  {Object.values(row).map(
                                    (value, columnIndex) => (
                                      <td key={columnIndex}>
                                        {String(
                                          value ?? "NULL"
                                        )}
                                      </td>
                                    )
                                  )}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="sql-empty-result">
                        Query returned no rows.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SQL;