const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const sqlite3 = require("better-sqlite3");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// SQLite database initialization
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3(dbPath);

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Create user table if not exists
const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;
  db.exec(sql); // Use exec for table creation
};
createUserTable();

// Handle user registration
app.post(
  "/register",
  [
    body("firstname").isString().trim().notEmpty().escape(),
    body("lastname").isString().trim().notEmpty().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).escape(),
    body("confirmPassword").custom((value, { req }) => value === req.body.password)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { firstname, lastname, email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user into database
      const insertUser = db.prepare(
        "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)"
      );
      const result = insertUser.run(firstname, lastname, email, hashedPassword);

      if (result.changes === 1) {
        res.status(200).json({ message: "Registration successful" });
      } else {
        throw new Error("Failed to insert user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
