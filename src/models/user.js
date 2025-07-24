const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
  },

  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Your Email is not valid!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Try some strong password ahead!");
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender is not valid!");
      }
    },
  },
  photoUrl: {
    default:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Your photo URL is not valid!");
      }
    },
  },
  about: {
    type: String,
    default: "This is a default about of the user!",
  },
  skills: {
    type: [String],
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
