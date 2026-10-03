const bcrypt = require("bcryptjs");
const db = require("../config/db");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);

          // Duplicate email
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "Email already exists"
            });
          }

          // Other database errors
          return res.status(500).json({
            message: "Registration failed"
          });
        }

        // Successful registration
        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId
        });
      }
    );

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
};
module.exports = {
  registerUser,
  loginUser
};