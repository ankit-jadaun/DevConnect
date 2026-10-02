const express = require("express");
const authRouter = express.Router();
const { validatorSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../Models/userModel")



// ==================================================
// AUTHENTICATION
// ==================================================

// -------------------- SIGNUP --------------------
authRouter.post("/signup", async (req, res) => {
  try {
    validatorSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({firstName,lastName,emailId,password: passwordHash});

    // Save user
    await user.save();

    res.status(201).json({message: "User created successfully"});

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});



// -------------------- LOGIN --------------------
authRouter.post("/login", async (req, res) => {
  try {
    const {emailId, password} = req.body;

    // Validate input
    if (!emailId || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        _id: user._id
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d"
      }
    );


    // Store JWT in cookie
    res.cookie("token", token);

    res.status(200).json({message: "Login successful", user});

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
});


// ------------------LOGOUT ---------------------
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    expires: new Date(Date.now())
  });

  res.status(200).json({message: "Logout successful"});
});





module.exports = authRouter;