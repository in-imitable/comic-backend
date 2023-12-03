const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const db = require("../config/database");

// User registration
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const insertUserQuery =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await db
      .promise()
      .execute(insertUserQuery, [username, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the user by email
    const queryUserQuery = "SELECT * FROM users WHERE email = ?";
    const [user] = await db.promise().execute(queryUserQuery, [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Compare the stored password hash with the provided password
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user[0].id,
          username: user[0].username,
          email: user[0].email,
        },
        config.secret,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
