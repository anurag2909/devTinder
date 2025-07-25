const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request!");
    }

    const loggedinUser = req.user;
    console.log(loggedinUser);

    Object.keys(req.body).every((key) => (loggedinUser[key] = req.body[key]));
    console.log("After editing -> " + loggedinUser);

    await loggedinUser.save();
    res.send(loggedinUser.firstName + ", your profile was edited successfully!");

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
