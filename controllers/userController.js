const User = require("../db/models/userModel")
const Vendor = require("../db/models/vendorModel")
const Otp = require("../db/models/emailOtpVerificationmodel")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOtp, sendOtp } = require("../utils/otp")

// register endpoint
module.exports.register = async (request, response, next) => {
  try {
    const userRole = request.body.role;
    const email = request.body.email;
    // hash the password
      const hashedPassword = await bcrypt.hash(request.body.password, 10)
        let user, OTP, hashedOTP, userotp;
        if(userRole==="user"){
          // Verifying Email
          OTP = generateOtp();
          hashedOTP = await bcrypt.hash(OTP, 10);

          user = await User.create({
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
            isVerified : false,
          });

          userotp = await Otp.create({
            email : request.body.email,
            otp : hashedOTP,
          });

        }
          else if(userRole==="vendor"){
            console.log('runs')
           user = await Vendor.create({
              name: request.body.name,
              shopname: request.body.shopname,
              phone: request.body.phone,
              password: hashedPassword,
            });
          }
          else{
            // 400 Bad Request : The server cannot or will not process the request due to something that is perceived to be a client error
            return response.status(400).send({
              message: "Role not specified"
            });
          }
            // console.log("will save user ", user)
            // console.log("will save", userotp)
            // save the new user
            if (userRole === "user")
            {
              await userotp.save();
            }

            await user.save()
              // return success if the new user is added to the database successfully
              .then((result) => {
                if(userRole === "user")
                {
                  sendOtp(email, OTP);
                }
                response.status(201).send({
                  message: "User Created Successfully",
                  result,
                });
              })
              // catch error if the new user wasn't added successfully to the database
              .catch((error) => {
                response.status(500).send({
                  message: "Error creating user",
                  error,
                });
              });
  } catch(error)
  {
    response.status(500).send({
      message: "Password was not hashed successfully",
      error,
    })
  }    
  };

  // login endpoint
module.exports.login = (request, response, next) => {
    // check if email exists
    const userRole = request.body.role;
    let search, DB;
    if(userRole == "user"){
      search = { email: request.body.email };
      DB = User;
    }
    else if(userRole == "vendor"){
      search = { phone: request.body.phone };
      DB = Vendor;
    }
    else{
      return response.status(400).send({
        message: "Role not specified"
      });
    }
  
    
    DB.findOne(search)
  
      // if email/phone exists
      .then((user) => {
         console.log(user);
        // compare the password entered and the hashed password found
        bcrypt.compare(request.body.password, user.password)
  
          // if the passwords match
          .then((passwordCheck) => {
  
            // check if password matches
            if(!passwordCheck) {
              return response.status(400).send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                id: user._id,
                userID: (userRole == "user")?user.email : user.shopname,
                userRole: userRole
              },
              "RANDOM-TOKEN",
              { expiresIn: "60h" }
            );
  
            //   return success response
            response.status(200).send({
              message: "Login Successful",
              ID: (userRole == "user")? user.email  : user.phone,
              token: token,
            });
          })
          // catch error if password do not match
          .catch((error) => {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        return response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  };

module.exports.verifyotp = async (request, response, next) =>{
  
  const email = request.body.email;
  const OTP = request.body.otp;
  const DB = Otp;
  try{
    const user = await DB.findOne({email : email});
  
    const matched = await bcrypt.compare(OTP, user.otp);
    if (matched) {
      // Update the isVerified field of the user
        try {
          const updatedUser = await User.updateOne(
            { email: user.email }, // Assuming user._id is the MongoDB ObjectId of the user
            { $set: { isVerified: true } }
          );
      
            if (updatedUser.nModified > 0) {
              return response.status(201).send({
                message: "Verified status updated Successfully",
                
              });
            } else {
              return response.status(500).send(
                {
                  message: "Verified status updation failed"
                })
            }
        } catch (error) {
          return response.status(500).send({
            message: "Internal Server Error",
            error: error.message 
          });
        }
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect OTP' });
    }
  }catch(error)
  {
    return response.status(500).send({
      message: "Internal Server Error (DB or bcrypt)",
      error: error.message 
    });
  }
}
