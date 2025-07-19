const express = require("express");

const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Renu",
    lastName: "Pandey",
    emailId: "Renu3112@gmail.com",
    password: "Renu@123",
  });

  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Something saving user " + err.message);
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
