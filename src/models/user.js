const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "dev@tinder#7290", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  console.log("user password is -> " + user.password);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
