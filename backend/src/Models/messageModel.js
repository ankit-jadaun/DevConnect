const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Dono users ke liye ek hi roomId (utils/chat.js ka getRoomId), isse poori chat ek query mein mil jaati hai
    roomId: {
      type: String,
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Chat history jaldi laane ke liye
messageSchema.index({ roomId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };