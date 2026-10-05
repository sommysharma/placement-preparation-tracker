import { useState } from "react";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setAnalysis(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      console.log("Upload Response:", uploadData);

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message || "Resume upload failed."
        );
      }

      const analyzeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: uploadData.text,
          }),
        }
      );

      const analyzeData = await analyzeResponse.json();

      console.log("Analysis Response:", analyzeData);

      if (!analyzeResponse.ok) {
        throw new Error(
          analyzeData.message || "Resume analysis failed."
        );
      }

      setAnalysis(analyzeData.analysis);
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderList = (items) => {
    if (!Array.isArray(items)) {
      return <p>{items || "Not available"}</p>;
    }

    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="resume-analyzer">

      <div className="resume-header">
        <h1>AI Resume Analyzer</h1>
        <p>
          Upload your resume and get an AI-powered analysis.
        </p>
      </div>

      <div className="upload-card">
        <h2>Upload Resume</h2>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {file && (
          <p className="selected-file">
            Selected: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>

      {analysis && (
        <div className="analysis-container">

          <div className="analysis-title">
            <h2>Resume Analysis</h2>
          </div>

          <div className="score-card">
            <h3>ATS Score</h3>

            <div className="score">
              {analysis.ats_score}
            </div>

            <p>out of 100</p>
          </div>

          <div className="analysis-card">
            <h3>Summary</h3>
            <p>{analysis.summary}</p>
          </div>

          <div className="analysis-card">
            <h3>Technical Skills</h3>
            {renderList(analysis.technical_skills)}
          </div>

          <div className="analysis-card">
            <h3>Recommended Skills</h3>
            {renderList(analysis.recommended_skills)}
          </div>

          <div className="analysis-card">
            <h3>Projects</h3>

            {Array.isArray(analysis.projects) &&
              analysis.projects.map((project, index) => (
                <div
                  className="project-analysis"
                  key={index}
                >
                  <h4>{project.name}</h4>

                  <p>
                    <strong>Strengths:</strong>{" "}
                    {project.strengths}
                  </p>

                  <p>
                    <strong>Improvements:</strong>{" "}
                    {project.improvements}
                  </p>
                </div>
              ))}
          </div>

          <div className="analysis-card">
            <h3>Education</h3>
            <p>{analysis.education}</p>
          </div>

          <div className="analysis-card">
            <h3>Strengths</h3>
            {renderList(analysis.strengths)}
          </div>

          <div className="analysis-card">
            <h3>Weak Areas</h3>
            {renderList(analysis.weak_areas)}
          </div>

          <div className="analysis-card">
            <h3>ATS Issues</h3>
            {renderList(analysis.ats_issues)}
          </div>

          <div className="analysis-card">
            <h3>Improvements</h3>
            {renderList(analysis.improvements)}
          </div>

        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;