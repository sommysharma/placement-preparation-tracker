import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState({
    dsaSolved: 0,
    sqlSolved: 0,
    totalApplications: 0,
    interviews: 0,
    selected: 0,
    rejected: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/dashboard/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        }

        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user.id]);

  const totalPractice =
    stats.dsaSolved + stats.sqlSolved;

  const totalInterviews =
    stats.interviews + stats.selected;

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1>
            Welcome, {user?.name || "Student"}
          </h1>

          <p>
            Track your placement preparation
            and progress.
          </p>
        </div>

      </div>

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <span>
            DSA Solved
          </span>

          <strong>
            {stats.dsaSolved}
          </strong>

          <small>
            Problems completed
          </small>

        </div>

        <div className="dashboard-stat-card">

          <span>
            SQL Solved
          </span>

          <strong>
            {stats.sqlSolved}
          </strong>

          <small>
            Questions completed
          </small>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Applications
          </span>

          <strong>
            {stats.totalApplications}
          </strong>

          <small>
            Companies tracked
          </small>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Interviews
          </span>

          <strong>
            {stats.interviews}
          </strong>

          <small>
            Interviews reached
          </small>

        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <h2>
              Preparation Overview
            </h2>

          </div>

          <div className="dashboard-progress-item">

            <div className="dashboard-progress-header">

              <span>
                DSA Practice
              </span>

              <strong>
                {stats.dsaSolved} solved
              </strong>

            </div>

            <div className="dashboard-progress-bar">

              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    (stats.dsaSolved / 200) * 100,
                    100
                  )}%`
                }}
              />

            </div>

          </div>

          <div className="dashboard-progress-item">

            <div className="dashboard-progress-header">

              <span>
                SQL Practice
              </span>

              <strong>
                {stats.sqlSolved} solved
              </strong>

            </div>

            <div className="dashboard-progress-bar">

              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    (stats.sqlSolved / 100) * 100,
                    100
                  )}%`
                }}
              />

            </div>

          </div>

          <div className="dashboard-total-practice">

            <span>
              Total Practice Completed
            </span>

            <strong>
              {totalPractice}
            </strong>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <h2>
              Placement Overview
            </h2>

          </div>

          <div className="placement-stat">

            <span>
              Total Applications
            </span>

            <strong>
              {stats.totalApplications}
            </strong>

          </div>

          <div className="placement-stat">

            <span>
              Interviews
            </span>

            <strong>
              {stats.interviews}
            </strong>

          </div>

          <div className="placement-stat">

            <span>
              Selected / Offers
            </span>

            <strong className="selected-count">
              {stats.selected}
            </strong>

          </div>

          <div className="placement-stat">

            <span>
              Rejected
            </span>

            <strong className="rejected-count">
              {stats.rejected}
            </strong>

          </div>

          <div className="placement-total">

            <span>
              Placement Journey
            </span>

            <strong>
              {totalInterviews}
            </strong>

          </div>

        </div>

      </div>

      <div className="dashboard-card dashboard-message">

        <h2>
          Keep Going
        </h2>

        <p>
          Every solved problem and every
          application brings you one step
          closer to your placement goal.
        </p>

      </div>

    </div>
  );
}

export default Dashboard;