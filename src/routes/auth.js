const express = require("express");
const bcrypt = require("bcrypt");

const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the incoming data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password, skills, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      age,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("EmailId does not exist");
    }

    console.log(password);

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Entered password is incorrect!");
    } else {
      // Create a JWT Token
      const token = user.getJWT();
      console.log(token);

      // Add the token to cookie and send the response back to the user

      res.cookie("token", token);
      res.send("User logged in successfully!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
