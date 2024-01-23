const mongoose = require("mongoose");

// user schema

const UserSchema = new mongoose.Schema({
  // Name field
  name: {
    type: String,
    required: [true, "Please provide a Name!"],
    unique: false,
  },
  
  // email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },

  // VerificationStatus
  isVerified : {
    type : Boolean,
    default : false,
  },
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);

