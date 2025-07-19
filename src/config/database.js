const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://anurag2992000:xo2YkT8yaNVZNXc6@nodejslearning.j2jhrz7.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};
