const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// to require the username model
const User = require("../models/user.js");

// Routes

router.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs");
});

// Create a user  

router.post('/sign-up', async (req, res) => {

const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
  return res.send("Username already taken.");
}

if (req.body.password !== req.body.confirmPassword) {
  return res.send("Password and Confirm Password must match");
}

const hashedPassword = bcrypt.hashSync(req.body.password, 10);
req.body.password = hashedPassword; //this one is for converting the value: replace  the existing string with the hash pas


const newUser = await User.create(req.body);
res.send(`Thanks for signing up ${newUser.username}`);
});

router.post('/sign-in', async (req, res)=>{

    const userInDatabase = await User.findOne({ username: req.body.username });

if (!userInDatabase) {
  return res.send("Login failed. Please try again.");
}

const validPassword = bcrypt.compareSync(
  req.body.password,
  userInDatabase.password
);
if (!validPassword) {
  return res.send("Login failed. Please try again.");
}

});



module.exports = router;
