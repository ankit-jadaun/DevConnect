require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./config/database");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");


const app = express();

// CORS
app.use
(cors({origin: "http://localhost:5173", credentials: true}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware
app.use(express.json()); // Parse incoming JSON request bodies
app.use(cookieParser()); // Parse cookies attached to incoming requests


// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });

  } catch (error) {
    console.log("Server failed to start:", error);
  }
};

startServer();