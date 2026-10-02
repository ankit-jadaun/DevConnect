const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://tbhanu448_db_user:Q4PvWsucnHB95V98@ac-bsatzpe-shard-00-00.nnxapwi.mongodb.net:27017,ac-bsatzpe-shard-00-01.nnxapwi.mongodb.net:27017,ac-bsatzpe-shard-00-02.nnxapwi.mongodb.net:27017/Tinder?ssl=true&replicaSet=atlas-477r4z-shard-0&authSource=admin&appName=Cluster0")
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed", error);
        throw error;
    }
} 

module.exports = { connectDB };