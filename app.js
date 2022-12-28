require("dotenv").config();
const express = require("express");
const User = require("./model/User");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello From Auth System</h1>");
});

app.post("/register", (req, res) => {
  const { firstName, lastName, country, email, password } = req.body;
  if (!(email && password && firstName && lastName && country)) {
    res.status(400).send("All Fields are Required");
  }

  const exsistingUser = User.findOne({ email });

  if (exsistingUser) {
    res.status(401).send("User Already Exsists");
  }
});
module.exports = app;
