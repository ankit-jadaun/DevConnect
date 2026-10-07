const { ConnectionRequest } = require("../Models/connectionRequest");

// Dono users ke beech accepted connection hai ya nahi (chat sirf connections ke beech hoti hai)
const areConnected = async (userA, userB) => {
  const connection = await ConnectionRequest.exists({
    status: "accepted",
    $or: [
      { fromUserId: userA, toUserId: userB },
      { fromUserId: userB, toUserId: userA },
    ],
  });

  return Boolean(connection);
};

// Dono users ke liye ek hi roomId (kaun pehle aaya, isse farak nahi padta)
const getRoomId = (userA, userB) => {
  return [userA.toString(), userB.toString()].sort().join("_");
};

module.exports = { areConnected, getRoomId };