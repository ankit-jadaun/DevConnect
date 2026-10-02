const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { ConnectionRequest } = require("../Models/connectionRequest");
const { User } = require("../Models/userModel");

//<-------------Send Connection Request API---------------->
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // Check if status is valid
    if (status !== "interested" && status !== "ignored") {
      return res.status(400).json({ error: "Invalid status type: " + status });
    }

    // Check if toUserId is a valid MongoDB ObjectId - its check format of the id
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Check if user is trying to send request to themselves
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ error: "You cannot send a connection request to yourself." });
    }

    // Check if receiver exists - its check if the user with the given toUserId exists in the database
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if request already exists means if the current user has already sent a connection request to the target user. If such a request exists, it means that the current user cannot send another request to that user, as they have already initiated a connection request. This check prevents duplicate requests and ensures that users cannot send multiple requests to the same user.
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (existingRequest) {
      return res.status(400).json({ error: "You have already sent a connection request to this user." });
    }

    // Check reverse request means if the user has already sent a connection request to the current user. If such a request exists, it means that the current user cannot send a new request to that user, as they have already received a request from them. This check prevents duplicate requests and ensures that users cannot send requests to each other if one of them has already initiated a connection request.
    const reverseRequest = await ConnectionRequest.findOne({ fromUserId: toUserId, toUserId: fromUserId });
    if (reverseRequest) {
      return res.status(400).json({ error: "The user has already sent you a connection request. You cannot send a request to them." });
    }

    // Create a new request
    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });

    // Save request to database
    const savedRequest = await connectionRequest.save();

    res.status(200).json({ message: `${req.user.firstName} is interested in ${toUser.firstName}`, savedRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



//<--------------Review Connection Request API------------->
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
   try {
      const loggedInUser = req.user; 
      const { requestId, status } = req.params;

       // check if status is valid 
       if( status !== "accepted" && status !== "rejected"){
          return res.status(400).json({ error: `Invalid request type ${status}` });
       }

      //  Check if requestId is a valid MongoDB ObjectId
      if(!mongoose.Types.ObjectId.isValid(requestId)){
      return res.status(400).json({ error: "Invalid connection request ID" });
      }

      // find connection request
      const connectionRequest = await ConnectionRequest.findById(requestId);
      if(!connectionRequest){
        return res.status(404).json({error: "Connection request not found" })
      }

      // check if loggedIn user is the reciever
      if(connectionRequest.toUserId.toString() !== loggedInUser._id.toString()){
        return res.status(403).json({ error: "You are not authorized to review this connection request.",})
      };

      // only interested requests can be reviewed
      if (connectionRequest.status !== "interested") {
        return res.status(400).json({error: `This connection request is already ${connectionRequest.status} and cannot be reviewed.`,});
      }

        // 6. Update request status
      connectionRequest.status = status;
      await connectionRequest.save();

      // 7. Success response
      return res.status(200).json({
        message: `Connection request ${status} successfully`,
        data: connectionRequest,
      });

   } catch (error) {
     return res.status(400).json({error: error.message,});
   }   

});

 
module.exports = requestRouter;