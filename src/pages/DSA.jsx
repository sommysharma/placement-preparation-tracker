import { useEffect, useState } from "react";
import "./DSA.css";

function DSA() {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] =
    useState("All");

  const [openTopics, setOpenTopics] = useState({});
  const [openSubtopics, setOpenSubtopics] =
    useState({});

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    async function loadData() {
      if (!user) {
        return;
      }

      try {
        const problemsResponse = await fetch(
          "http://localhost:5000/api/dsa/problems"
        );

        const progressResponse = await fetch(
          `http://localhost:5000/api/dsa/progress/${user.id}`
        );

        const problemsData =
          await problemsResponse.json();

        const progressData =
          await progressResponse.json();

        setProblems(problemsData);

        setSolvedProblems(
          progressData
            .filter(
              (item) => item.status === "Solved"
            )
            .map((item) => item.problem_id)
        );

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  function toggleTopic(topic) {
    setOpenTopics((previous) => ({
      ...previous,
      [topic]: !previous[topic]
    }));
  }

  function toggleSubtopic(subtopic) {
    setOpenSubtopics((previous) => ({
      ...previous,
      [subtopic]: !previous[subtopic]
    }));
  }

  async function markSolved(problemId) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dsa/progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user.id,
            problem_id: problemId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setSolvedProblems((previous) => {
        if (previous.includes(problemId)) {
          return previous;
        }

        return [...previous, problemId];
      });
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  }

  if (loading) {
    return (
      <div className="dsa-loading">
        <div className="loader"></div>
        <p>Loading A2Z DSA Sheet...</p>
      </div>
    );
  }

  const filteredProblems = problems.filter(
    (problem) => {
      const matchesSearch =
        problem.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const isSolved = solvedProblems.includes(
        problem.id
      );

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Solved" && isSolved) ||
        (statusFilter === "Pending" && !isSolved);

      const matchesDifficulty =
        difficultyFilter === "All" ||
        problem.difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty
      );
    }
  );

  const topics = {};

  filteredProblems.forEach((problem) => {
    if (!topics[problem.topic]) {
      topics[problem.topic] = {};
    }

    if (!topics[problem.topic][problem.subtopic]) {
      topics[problem.topic][problem.subtopic] = [];
    }

    topics[problem.topic][problem.subtopic].push(
      problem
    );
  });

  const topicEntries = Object.entries(topics);

  const progressPercentage =
    problems.length === 0
      ? 0
      : Math.round(
          (solvedProblems.length /
            problems.length) *
            100
        );

  const pendingCount =
    problems.length - solvedProblems.length;

  return (
    <div className="dsa-page">

      <div className="dsa-header">
        <div>
          <span className="dsa-label">
            DSA PREPARATION
          </span>

          <h1>TUF A2Z DSA Sheet</h1>

          <p>
            Follow the complete A2Z roadmap and build
            strong problem-solving skills.
          </p>
        </div>

        <div className="total-problems-card">
          <span>Total Problems</span>
          <strong>{problems.length}</strong>
        </div>
      </div>

      <div className="progress-card">

        <div className="progress-info">
          <div>
            <span>Your Progress</span>

            <h2>
              {solvedProblems.length} /{" "}
              {problems.length}
            </h2>
          </div>

          <div className="progress-percentage">
            {progressPercentage}%
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`
            }}
          ></div>
        </div>

        <p>
          {solvedProblems.length} solved ·{" "}
          {pendingCount} pending
        </p>

      </div>

      <div className="dsa-controls">

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-buttons">

          <button
            className={
              statusFilter === "All"
                ? "filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter("All")
            }
          >
            All
          </button>

          <button
            className={
              statusFilter === "Solved"
                ? "filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter("Solved")
            }
          >
            Solved
          </button>

          <button
            className={
              statusFilter === "Pending"
                ? "filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter("Pending")
            }
          >
            Pending
          </button>

        </div>

        <select
          value={difficultyFilter}
          onChange={(event) =>
            setDifficultyFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Difficulty
          </option>

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

      </div>

      <div className="dsa-section-header">

        <div>
          <h2>A2Z Roadmap</h2>

          <p>
            Showing {filteredProblems.length} of{" "}
            {problems.length} problems
          </p>
        </div>

      </div>

      <div className="topics-container">

        {topicEntries.map(
          ([topic, subtopics], topicIndex) => {

            const topicProblemCount =
              Object.values(subtopics).reduce(
                (total, list) =>
                  total + list.length,
                0
              );

            const isOpen = openTopics[topic];

            return (
              <div
                className={`topic-card ${
                  isOpen ? "topic-open" : ""
                }`}
                key={topic}
              >

                <button
                  className="topic-header"
                  onClick={() =>
                    toggleTopic(topic)
                  }
                >

                  <div className="topic-left">

                    <div className="topic-number">
                      {String(
                        topicIndex + 1
                      ).padStart(2, "0")}
                    </div>

                    <div>

                      <h3>{topic}</h3>

                      <span>
                        {topicProblemCount} problems
                      </span>

                    </div>

                  </div>

                  <div className="topic-arrow">
                    {isOpen ? "−" : "+"}
                  </div>

                </button>

                {isOpen && (
                  <div className="subtopics-container">

                    {Object.entries(
                      subtopics
                    ).map(
                      ([
                        subtopic,
                        topicProblems
                      ]) => {

                        const subtopicKey =
                          `${topic}-${subtopic}`;

                        const isSubtopicOpen =
                          openSubtopics[
                            subtopicKey
                          ];

                        return (
                          <div
                            className="subtopic"
                            key={subtopicKey}
                          >

                            <button
                              className="subtopic-header"
                              onClick={() =>
                                toggleSubtopic(
                                  subtopicKey
                                )
                              }
                            >

                              <div className="subtopic-title">

                                <span className="subtopic-icon">
                                  {isSubtopicOpen
                                    ? "▼"
                                    : "▶"}
                                </span>

                                <span>
                                  {subtopic}
                                </span>

                              </div>

                              <span className="problem-count">
                                {
                                  topicProblems.length
                                }
                              </span>

                            </button>

                            {isSubtopicOpen && (
                              <div className="problem-list">

                                {topicProblems.map(
                                  (
                                    problem,
                                    index
                                  ) => {

                                    const isSolved =
                                      solvedProblems.includes(
                                        problem.id
                                      );

                                    return (
                                      <div
                                        className={`problem-row ${
                                          isSolved
                                            ? "problem-solved"
                                            : ""
                                        }`}
                                        key={
                                          problem.id
                                        }
                                      >

                                        <div className="problem-index">
                                          {index + 1}
                                        </div>

                                        <div className="problem-info">

                                          <a
                                            href={
                                              problem.link
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {
                                              problem.name
                                            }
                                          </a>

                                          <div className="problem-meta">

                                            {problem.difficulty && (
                                              <span
                                                className={`difficulty-${problem.difficulty.toLowerCase()}`}
                                              >
                                                {
                                                  problem.difficulty
                                                }
                                              </span>
                                            )}

                                            <span>
                                              {problem.platform ||
                                                "Practice"}
                                            </span>

                                          </div>

                                        </div>

                                        {isSolved ? (
                                          <button
                                            className="solved-button"
                                            disabled
                                          >
                                            ✓ Solved
                                          </button>
                                        ) : (
                                          <button
                                            className="solve-button"
                                            onClick={() =>
                                              markSolved(
                                                problem.id
                                              )
                                            }
                                          >
                                            Mark Solved
                                          </button>
                                        )}

                                      </div>
                                    );
                                  }
                                )}

                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default DSA;