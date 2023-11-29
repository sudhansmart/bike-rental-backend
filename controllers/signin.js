const User = require('../models/User');
const { sendMail } = require('./sendMail');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const UserVerify = require('../models/UserVerify');
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new UserVerify({
      name: name,
      email: email,
      password: hashedPassword,
      token: token
    });

    const activationLink = `http://localhost:5175/signin/${token}`;
    const content = `<h4>Hello Rider,</h4>
                     <h5>Welcome to Go Glide</h5>
                     <p>Thank You For Signing up. Click on the below link to Activate</p>
                     <a href="${activationLink}">Click Here</a>
                     <p>Regards,</p>
                     <p>Team Go Glide</p>`;

    await newUser.save();
    console.log(newUser);
    sendMail(email, "User Verification", content);
  } catch (error) {
    console.log("Error occurred in InsertVerifyUser: ", error);
  }
}

function generateToken(email) {
  const token = jwt.sign({ email: email }, process.env.signUp_SecretKey, {
    expiresIn: '1h', // You can adjust the expiration time
  });

  return token;
}



async function InsertSignUpUser(token) {
  try {
    const userVerify = await UserVerify.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword: {},
        token: token, 
      });

      await newUser.save();
      await userVerify.deleteOne({ token: token });

      const content = `<h4>Hello Sir/Madam,</h4>
                        <h5>Welcome to Go Glide</h5>
                        <p>You are Successfully Registered</p>
                        <p>Regards,</p>
                        <p>Team Go Glide</p>`;

      sendMail(newUser.email, "Registration Successful", content);
    }
  } catch (error) {
    console.log("Error occurred in InsertSignUpUser: ", error);
  }
}




module.exports = { InsertVerifyUser, InsertSignUpUser };
