const express = require("express");

const app = express();
const { checkAuth } = require("./middlewares/auth");

app.use("/admin", checkAuth);

app.use("/admin/getAllData", (req, res) => {
  res.send("All data sent");
});

app.use("/admin/deleteAllData", (req, res) => {
  res.send("All data deleted");
});

app.listen(3000, () => {
  console.log("Sever is successfully listening on port 3000");
});
