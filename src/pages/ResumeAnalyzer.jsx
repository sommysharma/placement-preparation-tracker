import { useState } from "react";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setResumeText("");
    setAnalysis("");
    setMessage("");
  }

  async function uploadResume() {
    if (!file) {
      setMessage("Please select a resume");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Upload failed");
        return;
      }

      setResumeText(data.text || "");
      setMessage("Resume uploaded successfully");

    } catch (error) {
      console.log(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeResume() {
    if (!resumeText) {
      setMessage("Upload your resume first");
      return;
    }

    try {
      setAnalyzing(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: resumeText
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Resume analysis failed"
        );
        return;
      }

      setAnalysis(data.analysis || "");
      setMessage("Resume analysis completed");

    } catch (error) {
      console.log(error);
      setMessage("Server error");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="resume-page">
      <div className="resume-container">

        <h1>AI Resume Analyzer</h1>

        <p>
          Upload your resume and analyze it using AI.
        </p>

        <div className="resume-upload-card">

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          {file && (
            <p className="selected-file">
              Selected: {file.name}
            </p>
          )}

          <button
            onClick={uploadResume}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Resume"}
          </button>

          {resumeText && (
            <button
              onClick={analyzeResume}
              disabled={analyzing}
            >
              {analyzing
                ? "Analyzing with Gemini..."
                : "Analyze Resume"}
            </button>
          )}

          {message && (
            <p className="resume-message">
              {message}
            </p>
          )}

        </div>

        {resumeText && (
          <div className="resume-text-card">

            <h2>Extracted Resume Text</h2>

            <pre>{resumeText}</pre>

          </div>
        )}

        {analysis && (
          <div className="resume-analysis-card">

            <h2>AI Resume Analysis</h2>

            <div className="resume-analysis">
              {analysis}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeAnalyzer;