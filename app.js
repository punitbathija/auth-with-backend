require("dotenv").config();
require("./config/Databse").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/User");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello From Auth System</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, country, email, password } = req.body;
    if (!(email && password && firstName && lastName && country)) {
      res.status(400).send("All Fields are Required");
    }

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
      res.status(401).send("User Already Exsists");
    }

    const myEncPw = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { user_id: User._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    User.token = token;

    User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      country,
      password: myEncPw,
      token: token,
    })
      .then(console.log("User Registered"))
      .catch((error) => console.log(error));

    User.password = undefined;

    //token creaton
    res.status(201).json(User);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email, password)) {
      res.status(400).send("Some Field is Missing");
    }

    const user = await User.findOne({ email });

    if (User && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }
    res.status(400).send("email does not exsist");
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
