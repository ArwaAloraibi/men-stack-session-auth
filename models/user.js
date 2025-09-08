
// require 
const mongoose = require("mongoose");

//  define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// model
const User = mongoose.model("User", userSchema);

// export
module.exports = User;
