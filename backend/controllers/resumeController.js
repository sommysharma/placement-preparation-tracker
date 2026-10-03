const ai = require("../config/gemini");

const analyzeResume = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      message: "Resume text is required"
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",

      config: {
        responseMimeType: "application/json"
      },

      contents: `
You are an expert technical recruiter analyzing a software engineering placement resume.

Analyze ONLY the resume provided below.
Do not invent skills, experience, projects, qualifications, or achievements.

Return ONLY valid JSON.

Use exactly this structure:

{
  "ats_score": 0,
  "summary": "",
  "technical_skills": [],
  "recommended_skills": [],
  "projects": [
    {
      "name": "",
      "strengths": "",
      "improvements": ""
    }
  ],
  "education": "",
  "strengths": [],
  "weak_areas": [],
  "ats_issues": [],
  "improvements": []
}

Rules:
- ats_score must be a number from 0 to 100.
- technical_skills should contain skills actually present in the resume.
- recommended_skills should contain relevant skills that could improve the resume for software engineering placements.
- projects should contain only projects actually mentioned in the resume.
- Keep suggestions specific and actionable.
- Do not invent information.
- Return JSON only.

Resume:
${text}
`
    });

    let analysis;

    try {
      analysis = JSON.parse(response.text);
    } catch (parseError) {
      console.log("Gemini JSON parsing error:", parseError);

      return res.status(500).json({
        message: "Gemini returned invalid analysis format"
      });
    }

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis
    });

  } catch (error) {
    console.log("Gemini resume analysis error:", error);

    res.status(500).json({
      message: "Gemini resume analysis failed",
      error: error.message
    });
  }
};

module.exports = {
  analyzeResume
};