const jwt = require("jsonwebtoken");
const { User } = require("../Models/userModel");

const userAuth = async (req, res, next) => {
   try {
      const { token } = req.cookies;

      if(!token){
       return res.status(401).json({ message : "Please login first"});
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      )
      
      //req.userId = decoded._id isliye use kar rahe hain taaki user ki ID ko next route tak easily pahucha sakein.
      req.userId = decoded._id;

      const user = await User.findById(req.userId);
      req.user = user;

      next();
      // move to the req handler we use next();

   } catch (error) {
     return res.status(401).json({ message : "Invalid or expired token"});
   }
}

module.exports = userAuth;