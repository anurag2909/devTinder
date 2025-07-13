const express = require("express");

const app = express();

app.use('/user', (req, res) => {
    res.send("Hi, I am an user!");
});

app.post('/users', (req, res) => {
    res.send("Hi, I am an user to be posted!");
});

app.listen(3000, () => {
    console.log("Sever is successfully listening on port 3000");
});