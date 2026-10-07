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
    },

    // Premium user ne Super Like kiya ho to true.
    // Status phir bhi "interested" hi rehta hai, isliye review/accept ka purana flow waise hi chalta hai.
    isSuperLike: {
        type: Boolean,
        default: false
    }

},{ timestamps: true});

// if i will ever do connectionRequest.findOne({fromUserId: "123", toUserId: "456"}) then it will be faster because of this index.
   connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequest };
