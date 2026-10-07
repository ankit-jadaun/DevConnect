const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../Models/userModel");
const { Message } = require("../Models/messageModel");
const { areConnected, getRoomId } = require("./chat");

let io;

// Cookie string se token nikalne ke liye ("token=abc; other=xyz" -> "abc")
const getTokenFromCookie = (cookieHeader = "") => {
  const tokenCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="));

  return tokenCookie ? tokenCookie.slice("token=".length) : null;
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://devconnect-app.duckdns.org"],
      credentials: true,
    },
  });

  // Har socket connection par check karo ki user logged-in hai (wahi JWT cookie jo auth middleware use karta hai)
  io.use(async (socket, next) => {
    try {
      const token = getTokenFromCookie(socket.handshake.headers.cookie);

      if (!token) {
        return next(new Error("Please login first"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await User.findById(decoded._id).select("_id");
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Har user ka apna private room, taaki sirf usi ko notification / message jaye
    socket.join(`user:${socket.userId}`);

    // ---------- Chat: message bhejna ----------
    socket.on("sendMessage", async ({ friendId, text }) => {
      try {
        // 1) Basic validation
        if (
          !mongoose.Types.ObjectId.isValid(friendId) ||
          typeof text !== "string" ||
          !text.trim()
        ) {
          return socket.emit("chatError", "Invalid message");
        }

        if (text.trim().length > 1000) {
          return socket.emit(
            "chatError",
            "Message is too long (max 1000 characters)",
          );
        }

        // 2) Sender ka naam (notification mein dikhane ke liye)
        const sender = await User.findById(socket.userId).select(
          "firstName lastName",
        );

        // 3) Sirf connections ke beech chat (premium ki zaroorat nahi)
        const connected = await areConnected(socket.userId, friendId);
        if (!connected) {
          return socket.emit(
            "chatError",
            "You can only chat with your connections",
          );
        }

        // 4) Message save karo
        const message = await Message.create({
          roomId: getRoomId(socket.userId, friendId),
          senderId: socket.userId,
          receiverId: friendId,
          text: text.trim(),
        });

        const payload = {
          _id: message._id.toString(),
          senderId: socket.userId,
          receiverId: friendId,
          text: message.text,
          createdAt: message.createdAt,
          sender: { firstName: sender.firstName, lastName: sender.lastName },
        };

        // 5) Dono ko bhejo (sender ko bhi, taaki uska apna message bhi usi tarah dikhe)
        io.to(`user:${socket.userId}`)
          .to(`user:${friendId}`)
          .emit("messageReceived", payload);
      } catch (error) {
        console.log("sendMessage error:", error);
        socket.emit("chatError", "Could not send the message");
      }
    });
  });
};

// Kisi ek user ko live event bhejne ke liye
// Use: sendToUser(userId, "superLikeReceived", { ... })
const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

module.exports = { initializeSocket, sendToUser };
