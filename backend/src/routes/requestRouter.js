const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { ConnectionRequest } = require("../Models/connectionRequest");
const { User } = require("../Models/userModel");
const { sendToUser } = require("../utils/socket");
const { sendEmail } = require("../config/ses");

// Ek premium user din mein kitne Super Like kar sakta hai
const SUPER_LIKE_DAILY_LIMIT = 5;

//<-------------Send Connection Request API---------------->
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Check if status is valid
      if (
        status !== "interested" &&
        status !== "ignored" &&
        status !== "superliked"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid status type: " + status });
      }

      // Check if toUserId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ error: "Invalid user ID." });
      }

      // Check if user is trying to send request to themselves
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          error: "You cannot send a connection request to yourself.",
        });
      }

      // Check if receiver exists
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ error: "User not found." });
      }

      // Super Like sirf premium users ke liye hai
      const isSuperLike = status === "superliked";

      if (isSuperLike) {
        if (!req.user.isPremium) {
          return res.status(403).json({
            error: "Super Like is a Premium feature. Upgrade to use it.",
          });
        }

        // Aaj ke Super Likes gino
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const usedToday = await ConnectionRequest.countDocuments({
          fromUserId,
          isSuperLike: true,
          createdAt: { $gte: startOfToday },
        });

        if (usedToday >= SUPER_LIKE_DAILY_LIMIT) {
          return res.status(429).json({
            error: `You have used all ${SUPER_LIKE_DAILY_LIMIT} Super Likes for today. Try again tomorrow.`,
          });
        }
      }

      // Check if request already exists
      const existingRequest = await ConnectionRequest.findOne({
        fromUserId,
        toUserId,
      });

      if (existingRequest) {
        return res.status(400).json({
          error: "You have already sent a connection request to this user.",
        });
      }

      // Check reverse request
      const reverseRequest = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
      });

      if (reverseRequest) {
        return res.status(400).json({
          error:
            "The user has already sent you a connection request. You cannot send a request to them.",
        });
      }

      // Create new request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: isSuperLike ? "interested" : status,
        isSuperLike,
      });

      // Save request to database
      const savedRequest = await connectionRequest.save();

      // Super Like hai to receiver ko turant live notification bhejo
      if (isSuperLike) {
        sendToUser(toUserId, "superLikeReceived", {
          requestId: savedRequest._id,
          from: {
            _id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            photoUrl: req.user.photoUrl,
            isPremium: req.user.isPremium,
          },
        });
      }

      // Send email notification to receiver
      if (toUser.emailId) {
        try {
          await sendEmail({
            to: toUser.emailId,
            subject: isSuperLike
              ? `${req.user.firstName} sent you a Super Like on DevConnect`
              : `${req.user.firstName} is interested in connecting with you`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                <h2>DevConnect</h2>
                <p>Hello ${toUser.firstName || "there"},</p>

                <p>
                  <strong>${req.user.firstName} ${req.user.lastName || ""}</strong>
                  ${
                    isSuperLike
                      ? " sent you a Super Like."
                      : " is interested in connecting with you."
                  }
                </p>

                ${
                  isSuperLike
                    ? `<p>⭐ This was a Premium Super Like.</p>`
                    : ""
                }

                <p>Open DevConnect to view the request.</p>

                <p>
                  Best regards,<br />
                  DevConnect Team
                </p>
              </div>
            `,
            text: `Hello ${toUser.firstName || "there"}, ${req.user.firstName} ${
              req.user.lastName || ""
            } ${
              isSuperLike
                ? "sent you a Super Like."
                : "is interested in connecting with you."
            }`,
          });

          console.log(`Email sent successfully to ${toUser.emailId}`);
        } catch (emailError) {
          // Email failure should not fail the connection request
          console.error("SES email failed:", emailError.message);
        }
      }

      return res.status(200).json({
        message: isSuperLike
          ? `${req.user.firstName} super liked ${toUser.firstName}`
          : `${req.user.firstName} is interested in ${toUser.firstName}`,
        savedRequest,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

//<--------------Review Connection Request API------------->
requestRouter.post("/request/review/:status/:requestId",userAuth,async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      // Check if status is valid
      if (status !== "accepted" && status !== "rejected") {
        return res
          .status(400)
          .json({ error: `Invalid request type ${status}` });
      }

      // Check if requestId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ error: "Invalid connection request ID" });
      }

      // Find connection request
      const connectionRequest = await ConnectionRequest.findById(requestId);

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ error: "Connection request not found" });
      }

      // Check if loggedIn user is the receiver
      if (
        connectionRequest.toUserId.toString() !== loggedInUser._id.toString()
      ) {
        return res.status(403).json({
          error: "You are not authorized to review this connection request.",
        });
      }

      // Only interested requests can be reviewed
      if (connectionRequest.status !== "interested") {
        return res.status(400).json({
          error: `This connection request is already ${connectionRequest.status} and cannot be reviewed.`,
        });
      }

      // Update request status
      connectionRequest.status = status;
      await connectionRequest.save();

      return res.status(200).json({
        message: `Connection request ${status} successfully`,
        data: connectionRequest,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
);

module.exports = requestRouter;