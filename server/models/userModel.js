/*const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  // New field for blocked users
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming your user model is named 'User'
  }]
});

module.exports = mongoose.model("User", userSchema);
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  // New field for blocked users
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming your user model is named 'User'
  }],
  // Field to track violations
  violations: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("User", userSchema);
