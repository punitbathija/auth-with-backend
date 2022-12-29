require("dotenv").config();
require("./config/Databse").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./model/User");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello From Auth System</h1>");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, country, email, password } = req.body;
  if (!(email && password && firstName && lastName && country)) {
    res.status(400).send("All Fields are Required");
  }

  const exsistingUser = await User.findOne({ email });

  if (exsistingUser) {
    res.status(401).send("User Already Exsists");
  }

  const myEncPw = await bcrypt.hash(password, 10);

  User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    country,
    password: myEncPw,
  })
    .then(console.log("User Registered"))
    .catch((error) => console.log(error));
});
module.exports = app;
