const express = require("express");

const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // Validate of the incoming data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Entered password is incorrect!");
    } else {
      res.send("User logged in successfully!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log("UserId -> " + userId);

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted siccessfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    console.log("isUpdateAllowed -> " + isUpdateAllowed);

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    console.log("User updated successfully!");
    res.send("User updated successfully!");
  } catch (err) {
    res.status(404).send(err.message);
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
