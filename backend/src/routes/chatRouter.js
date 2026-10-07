const express = require("express");
const mongoose = require("mongoose");
const chatRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { User } = require("../Models/userModel");
const { Message } = require("../Models/messageModel");
const { areConnected, getRoomId } = require("../utils/chat");

//<-------------Get Chat History API---------------->
// Connection ho to chat history mil jaati hai (premium ki zaroorat nahi).
chatRouter.get("/chat/:friendId", userAuth, async (req, res) => {
  try {
    const { friendId } = req.params;

    // Check if friendId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Sirf connections ke saath chat
    const connected = await areConnected(req.user._id, friendId);
    if (!connected) {
      return res.status(403).json({ message: "You can only chat with your connections" });
    }

    const friend = await User.findById(friendId).select("firstName lastName photoUrl isPremium");
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Aakhri 50 messages (naye pehle), phir seedha karke bhejo (purane upar, naye neeche)
    const roomId = getRoomId(req.user._id, friendId);
    const messages = await Message.find({ roomId }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({ friend, messages: messages.reverse() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = chatRouter;