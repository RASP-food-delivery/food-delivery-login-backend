const mongoose = require("mongoose");

// Vendor schema

const VendorSchema = new mongoose.Schema({
  // Name field
  name: {
    type: String,
    required: [true, "Please provide a Name!"],
    unique: false,
  },
  
  // ShopeName field
    shopname: {
      type: String,
      required: [true, "Please provide a Shop Name!"],
      unique: false,
    },
    
  // phone no. field
  phone: {
    type: String,
    required: [true, "Please provide a Phone No.!"],
    unique: [true, "Phone No. Exist"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

// export VendorSchema
module.exports = mongoose.model.Vendors || mongoose.model("Vendors", VendorSchema);

