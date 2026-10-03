import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DSA from "./pages/DSA";
import SQL from "./pages/SQL";
import Companies from "./pages/Companies";
import Interview from "./pages/Interview";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewReport from "./pages/InterviewReport";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route
  path="/interview/report/:id"
  element={<InterviewReport />}
/>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/dsa" element={<DSA />} />

            <Route path="/sql" element={<SQL />} />

            <Route path="/companies" element={<Companies />} />

            <Route path="/interview" element={<Interview />} />

            <Route
              path="/resume-analyzer"
              element={<ResumeAnalyzer />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;