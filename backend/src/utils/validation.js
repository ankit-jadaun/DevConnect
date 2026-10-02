const validator = require("validator");

const validatorSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name Is Not Valid Please Enter A Valid FirstName And LastName");
  } 
  
  else if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter A Valid Email Address");
  } 
  
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter A Strong Password");
  }
};





const validatorEditProfileData = (req) => {
  const allowedEditFields = [
    // User ne jo fields bheji hain unhe allowed fields ke saath check karta hai
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills"
  ];

  // Check for unwanted fields
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid profile field");
  }

  // Check if photoUrl is a valid URL
  if (req.body.photoUrl) {
    try {
      new URL(req.body.photoUrl);
    } catch {
      throw new Error("Invalid photo URL");
    }
  }

  return isEditAllowed;
};

module.exports = validatorEditProfileData;


module.exports = { validatorSignUpData, validatorEditProfileData };