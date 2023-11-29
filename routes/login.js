const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { AuthenticateUser } = require('../controllers/login');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body; // Remove the unnecessary use of await here
    const logincred = await AuthenticateUser(email, password);
   
    if (logincred === "Invalid Username or Password") {
      res.status(200).send("Invalid Username or Password");
    } else if (logincred === "Server Busy") {
      res.status(200).send("Server Busy");
    } else {
      res.status(201).send(logincred);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.login_SecretKey);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// Route to get user information
router.get('/userinfo', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ username: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user information');
  }
});

module.exports = router;
