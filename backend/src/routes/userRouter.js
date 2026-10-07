const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { ConnectionRequest } = require("../Models/connectionRequest");
const { User } = require("../Models/userModel");

// Dusre users ke liye jo fields bhejni hain (isPremium se blue tick dikhta hai)
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills isPremium";



// GET all the pending requests received by a logged-In User
userRouter.get("/user/requests/recieved", userAuth , async (req,res) => {
     try {
         const loggedInUser = req.user; 

         const connectionRequest = await ConnectionRequest.find({ 
            toUserId: loggedInUser._id,
            status: "interested",
         }).populate(
            "fromUserId",
            USER_SAFE_DATA
         );

         return res.status(200).json({ message: "Connection Request fetched successfully", connectionRequest});
        
     } catch (error) {
         return res.status(400).json({error: error.message,});
     }
});



// for viewing all connections of a logged-In User
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
            status: "accepted"
        }).populate(
            "fromUserId", USER_SAFE_DATA
        ).populate(
            "toUserId", USER_SAFE_DATA
        );

        const connectionList = connections.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }
        });

        res.status(200).json({
            message: "Connections fetched successfully",
            connections: connectionList
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});



// for feed of a logged-In User 
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // 1 - Find logged-in user
        const loggedInUser = req.user;

        // 2 - Find all connection requests of logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId status");

        // 3 - Hide users who already have a connection/request
        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        // 4 - Pagination
        const page = Number(req.query.page) || 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        // 5 - Find users except hidden users and logged-in user
        const users = await User.find({
            _id: {
                $nin: [...hideUsersFromFeed, loggedInUser._id]
            }
        })
        .select(USER_SAFE_DATA)
        .sort({ isPremium: -1, createdAt: -1 }) // Premium users sabse pehle (priority in feed), phir naye users
        .skip(skip)
        .limit(limit);

        // 6 - Send response
        res.status(200).json({
            message: "Users fetched successfully",
            page,
            users
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});






module.exports = userRouter;