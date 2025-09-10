const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// to require the username model
const User = require("../models/user.js");

// Routes

// To render the sign-in file
router.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", async (req, res) => {
  res.render("auth/sign-in.ejs");
});

// sign-out: bur doesn't delete the accout 
router.get("/sign-out", (req, res) => {
req.session.destroy();
  res.redirect("/");});

// Create a user  

router.post('/sign-up', async (req, res) => {

const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
  return res.send("Username already taken"); //You are in the database
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
 // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/");

});




module.exports = router;
