import { Link } from "react-router-dom";
import "./Sidebar.css";
function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/dsa">DSA Tracker</Link>
        </li>

        <li>
          <Link to="/sql">SQL Practice</Link>
        </li>

        <li>
          <Link to="/companies">Companies</Link>
        </li>

        <li>
          <Link to="/interview">Mock Interview</Link>
        </li>

        <li>
          <Link to="/resume-analyzer">AI Resume Analyzer</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;