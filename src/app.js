const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

app.use("/getData", (req, res) => {
    res.send("I am getting the data from it");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});



app.listen(3000, () => {
    console.log("Sever is successfully listening on port 3000");
});