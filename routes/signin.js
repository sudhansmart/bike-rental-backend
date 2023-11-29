const express = require('express');
const router = express.Router();
const { CheckUser } = require('../controllers/login');
const { InsertVerifyUser, InsertSignUpUser } = require('../controllers/signin');

router.get('/:token', async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(`<h4>Hello Rider</h4> 
                           <h5>You are SucessFully Registered</h5>
                           <h6>Please goto the login page You can use our Service</h6>
                           <p>Regards,</p>
                           <p>Go Glide</p>`);
  } catch (error) {
    console.log("error occurred in get token: ", error);
    res.status(500).send(`<h4>Hello Rider,</h4>
      <h5>Registration Failed</h5>
      <p>Link Expired</p>
      <p>Regards,</p>
      <p>Go Glide</p>`);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { name, email, password } = req.body; // Removed await as req.body is synchronous

    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password); // Corrected the parameter order
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(201).send(false);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server Busy");
    }
  } catch (error) {
    console.log("Error occurred in /verify route: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
