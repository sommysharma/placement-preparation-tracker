# Placement Preparation & Interview Tracker

A full-stack web application designed to help students prepare for software engineering placements by combining **DSA practice, SQL practice, company application tracking, mock interviews, performance analytics, and AI-powered resume analysis** in one platform.

## 🚀 Features

### 🔐 Authentication

* User registration and login
* Password hashing using bcrypt
* Protected routes
* Persistent login using local storage

### 💻 DSA Practice

* 400+ DSA problems
* Problems organized by topic and category
* Search and filtering
* Difficulty-based filtering
* Mark problems as solved
* User-specific DSA progress tracking

### 🗄️ SQL Practice

* 100 SQL interview questions
* Practice using a dedicated SQL database
* Query execution through the backend
* Solved-question tracking
* Support for SELECT and WITH queries

### 🏢 Company Tracker

Track placement applications with:

* Company name
* Job role
* Package
* Application date
* Application status
* Interview rounds
* Rounds cleared
* Notes

### 📊 Dashboard

The dashboard provides an overview of placement preparation progress, including:

* DSA problems solved
* SQL questions solved
* Applications
* Interviews
* Selected and rejected applications
* Overall preparation statistics

### 🤖 AI Mock Interview

The application provides a text-based AI mock interview system.

Users can configure:

* Interview topic
* Difficulty
* Company type
* Package range

The system then:

1. Generates 10 interview questions using Gemini AI
2. Collects user answers
3. Evaluates each answer using AI
4. Provides a score and feedback
5. Calculates the overall interview score
6. Generates a detailed interview report

### 📄 AI Resume Analyzer

Upload a PDF resume and receive an AI-generated analysis containing:

* ATS score
* Resume summary
* Technical skills
* Recommended skills
* Project analysis
* Education analysis
* Resume strengths
* Weak areas
* ATS issues
* Improvement suggestions

The application extracts resume text from the uploaded PDF before sending it to the AI analysis service.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite
* React Router

### Backend

* Node.js
* Express.js
* REST APIs
* Multer
* PDF parsing

### Database

* MySQL
* MySQL2

### AI

* Google Gemini API

### Authentication & Security

* bcryptjs
* Environment variables
* Protected React routes
* API-based backend architecture

### Development Tools

* VS Code
* Git
* GitHub
* Thunder Client

---

## 🏗️ Project Architecture

```text
placement-preparation-tracker/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── gemini.js
│   │
│   ├── controllers/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

> `.env` contains private credentials and is intentionally excluded from GitHub.

---

## 🔄 Application Flow

```text
React Frontend
      │
      ▼
Express REST API
      │
      ├──────────────► MySQL Database
      │
      └──────────────► Gemini AI
```

### Example AI Interview Flow

```text
Start Interview
      ↓
Create Interview
      ↓
Gemini Generates 10 Questions
      ↓
User Answers Questions
      ↓
Gemini Evaluates Answers
      ↓
Scores + Feedback Stored
      ↓
Interview Report
```

### Resume Analyzer Flow

```text
Upload PDF
    ↓
Multer
    ↓
PDF Text Extraction
    ↓
Resume Text
    ↓
Gemini AI
    ↓
Structured JSON Analysis
    ↓
Resume Analysis Dashboard
```

---

## 📁 Major API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### DSA

```text
GET /api/dsa/problems
```

### SQL

```text
GET /api/sql/questions
POST /api/sql/run
```

### Companies

```text
GET    /api/companies
POST   /api/companies
PUT    /api/companies/:id
DELETE /api/companies/:id
```

### Dashboard

```text
GET /api/dashboard/:userId
```

### Mock Interviews

```text
POST /api/mock-interviews
POST /api/mock-interviews/:id/generate-questions
GET  /api/mock-interviews/:id/questions
PUT  /api/mock-interviews/questions/:id/answer
POST /api/mock-interviews/questions/:id/evaluate
POST /api/mock-interviews/:id/complete
GET  /api/mock-interviews/:id/report
```

### Resume Analyzer

```text
POST /api/resume/upload
POST /api/resume/analyze
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/sommysharma/placement-preparation-tracker.git
cd placement-preparation-tracker
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create:

```text
backend/.env
```

Add your local configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Configure your MySQL credentials in the backend database configuration.

**Never commit `.env` to GitHub.**

### 5. Start the backend

From the `backend` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start the frontend

From the project root:

```bash
npm run dev
```

The frontend runs on the Vite development server.

---

## 🔒 Security

The project uses environment variables for sensitive credentials.

The following files should never be committed:

```text
.env
backend/.env
```

API keys and database credentials should always be configured through environment variables.

---

## 🎯 Project Goals

This project was built to provide a practical placement-preparation platform while demonstrating full-stack development skills including:

* Frontend development with React
* REST API development
* Backend development with Node.js and Express
* Relational database design with MySQL
* Authentication and authorization concepts
* File upload and PDF processing
* AI API integration
* Structured AI responses
* User-specific progress tracking
* Full-stack application architecture

---

## 🔮 Future Improvements

Potential future improvements include:

* Cloud deployment
* Advanced analytics
* More interview categories
* Additional AI-powered career features
* Improved resume optimization
* More comprehensive placement statistics

---

## 👨‍💻 Author

**Somdutt Sharma**

BE – Computer Science & Engineering

GitHub: [Somdutt Sharma](https://github.com/sommysharma)
