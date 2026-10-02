
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
       type: String,
       required: true,
       enum: {
          values: ["interested", "ignored", "accepted", "rejected"], // enum = fixed/allowed options.
          message: `{VALUE} is not supported`
        }


    }
     
},{ timestamps: true});

// if i will ever do connectionRequest.findOne({fromUserId: "123", toUserId: "456"}) then it will be faster because of this index.
   connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequest };