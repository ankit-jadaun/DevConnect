const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: "Password is not strong enough",
      },
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} not supported`,
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgcaRVTzB-vODxm5Yb-z-y9_ypCA8QaUdzYiF82o6yZA&s=10",
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Please enter a valid photo URL",
      },
    },

    about: {
      type: String,
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };