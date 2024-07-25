const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("better-sqlite3")("database.db");

const app = express();
const port = process.env.PORT || 3000; // Or use process.env.PORT if specified

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
  db.prepare(sql).run();
};
createUserTable();

// Handle user registration
app.post(
  "/register",
  [
    body("firstname").isString().trim().escape(),
    body("lastname").isString().trim().escape(),
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
      const hashedPassword = await bcrypt.hash(password, 12);
      const sql = `
        INSERT INTO user (firstname, lastname, email, password)
        VALUES (?, ?, ?, ?)
      `;
      db.prepare(sql).run(firstname, lastname, email, hashedPassword);
      res.status(200).json({ message: "Registration successful" });
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
