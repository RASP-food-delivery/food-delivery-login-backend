const User = require("../db/models/userModel")
const Vendor = require("../db/models/vendorModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register endpoint
module.exports.register = async (request, response, next) => {
  try {
    const userRole = request.body.role;
    // hash the password
      const hashedPassword = await bcrypt.hash(request.body.password, 10)
        let user;
        if(userRole==="user"){
          user = await User.create({
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
          });
          console.log(request.body)
        }
          else if(userRole==="vendor"){
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
            console.log("will save user ", user)
          
            // save the new user
            await user.save()
              // return success if the new user is added to the database successfully
              .then((result) => {
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
                userId: user._id,
                userID: (userRole == "user")?user.email : user.phone,
                // userPhone : user.phone
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
            console.log("password")
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        console.log("email")
        return response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  };