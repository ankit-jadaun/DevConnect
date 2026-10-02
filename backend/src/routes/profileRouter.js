const express = require("express");
const profileRouter = express.Router();
const { User } = require("../Models/userModel")
const userAuth = require("../middlewares/auth");
const { validatorEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");


// -------------------- GET PROFILE --------------------
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {

    // Find user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    res.status(200).json({
      message: "Profile data retrieved successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
     message: "Something went wrong"
});
  }
});



// --------------------- EDIT PROFILE DETAILS----------------------
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validatorEditProfileData(req);

    const loggedInUser = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      user: updatedUser
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});



// ------------------EDIT USER PROFILE PASSWORD----------------------
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
       const { oldPassword, newPassword } = req.body;

        // check if oldPassword and newPassword are provided
       if(!oldPassword || !newPassword){
         return res.status(400).json({message: "Old Password Is Incorrect"});
       }

       // Get logged-in user
       const loggedInUser = req.user;

       // Check old password
       const isPasswordValid = await bcrypt.compare(
        oldPassword,
        loggedInUser.password
       );

       // check if old password is correct
       if(!isPasswordValid){
         return res.status(400).json({ message: "Old Password Is Incorrect" });
       }

       // now hash the new password
       const hashedPassword = await bcrypt.hash(newPassword, 10);

       // update the password in the database
       loggedInUser.password = hashedPassword;

       // save the updated user
        await loggedInUser.save();

       res.status(200).json({ message: "Password Updated Successfully", user: loggedInUser });

       
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});




module.exports = profileRouter;












// edit profile details points jo code m hai
// 1. Validate request data
//    → Check karta hai ki user ne sirf allowed fields bheji hain.

// 2. Get logged-in user
//    → req.user se currently logged-in user ko leta hai.

// 3. Update profile
//    → loggedInUser._id ke basis par database me profile update karta hai.

// 4. req.body
    //  -> req.body me jo fields hain unhe update karta hai.

// 5. Return updated user
//    → new: true se updated user data milta hai.

// 6. Run schema validation
//    → runValidators: true se Mongoose schema validations apply hoti hain.

// 7. Send success response
//    → Profile successfully updated ka response bhejta hai.

// 8. Handle errors
//    → Error hone par catch block se error message return karta hai.