const mongoose = require("mongoose");

const root = process.env.FIREBASE_URL;

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
  img: {
    type: String,
    get: v => `${root}${v}`,
    default: "unavailable.jpg?alt=media&token=6633cfd8-020f-4980-b895-b7ee78ff61bb"
  },
  isVerified : {
    type : Boolean,
    default : false,
  }
},
{
    toObject : {getters: true},
    toJSON : {getters: true}
});

// export VendorSchema
module.exports = mongoose.model.Vendors || mongoose.model("Vendors", VendorSchema);

