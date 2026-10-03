const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const { analyzeResume } = require("../controllers/resumeController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required"
      });
    }

    try {
      const parser = new PDFParse({
        data: req.file.buffer
      });

      const data = await parser.getText();

      await parser.destroy();

      res.status(200).json({
        message: "Resume uploaded successfully",
        fileName: req.file.originalname,
        text: data.text
      });

    } catch (error) {
      console.log("PDF extraction error:", error);

      res.status(500).json({
        message: "Failed to extract resume text",
        error: error.message
      });
    }
  }
);

router.post("/analyze", analyzeResume);

module.exports = router;