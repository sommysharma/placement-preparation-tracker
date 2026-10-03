const fs = require("fs");
const path = require("path");

const sourceFolder = path.join(
  __dirname,
  "sql",
  "SQL-Practice-Questions-main"
);

const outputFile = path.join(
  __dirname,
  "sqlQuestions.json"
);

const files = fs.readdirSync(sourceFolder);

const questions = [];
let id = 1;

files.forEach((file) => {
  if (
    file === "README.md" ||
    file.endsWith(".sql")
  ) {
    return;
  }

  const filePath = path.join(
    sourceFolder,
    file
  );

  const content = fs.readFileSync(
    filePath,
    "utf-8"
  );

  const lines = content.split("\n");

  lines.forEach((line) => {
    const text = line
      .replace(/^--\s*/, "")
      .trim();

    if (text) {
      questions.push({
        id: id++,
        category: file,
        difficulty: "Medium",
        question: text,
        concept: file
      });
    }
  });
});

fs.writeFileSync(
  outputFile,
  JSON.stringify(questions, null, 2)
);

console.log(
  `${questions.length} SQL questions created`
);