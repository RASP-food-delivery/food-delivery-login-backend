const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Vendor = require("./db/vendorModel");
const auth = require("./auth");

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});


// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  console.log("body that came was:", request.body);

  const userRole = request.body.role;
  
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data based on the role
      let user;
      if(userRole=="user"){
        user = new User({
          name: request.body.name,
          email: request.body.email,
          password: hashedPassword,
        });
      }
      else if(userRole=="vendor"){
        user = new Vendor({
          name: request.body.name,
          shopname: request.body.shopname,
          phone: request.body.phone,
          password: hashedPassword,
        });
      }
      else{
        return response.status(400).send({
          message: "Role not specified"
        });
      }
      console.log("will save user ", user)
      
    
      // save the new user
      user
        .save()
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
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});



// login endpoint
app.post("/login", (request, response) => {
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
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

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
              userID: (userRole == "user")?user.email:user.phone,
              // userPhone : user.phone
            },
            "RANDOM-TOKEN",
            { expiresIn: "60h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            ID: (userRole == "user")?user.email:user.phone,
            token: token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.send({ message: "You are authorized to access me" });
});

module.exports = app;
