const express = require("express");

const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(7777, () => {
      console.log("Server is listening on port no 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
