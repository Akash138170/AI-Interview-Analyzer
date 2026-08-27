const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already exist"],
    required: true,
  },

  email: {
    type: String,
    unique: [true, "Email already exist"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
