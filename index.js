const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("./Model/user.model");
const { connection } = require("./Confige/db");
const { TodoRoutes } = require("./Routes/todoRoutes");
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, password, age } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      res.send("email is already registered");
    } else {
      bcrypt.hash(password, 8, async (err, hash) => {
        const user = new UserModel({ name, email, password: hash, age });
        await user.save();
        res.send("Registered");
      });
    }
  } catch (err) {
    res.send("Error in registering the user");
    console.log(err);
  }
});

//while Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
          res.send("something went wrong");
        } else if (result) {
          const token = jwt.sign({ userId: user._id }, process.env.key);

          res.send({ msg: "Login Successfull", token: token });
        } else {
          res.send("Wrong Credntials");
        }
      });
    } else {
      res.send("Wrong Credntials");
    }
  } catch (err) {
    res.send("Something went wrong");
    console.log(err);
  }
});

app.use("/todos", TodoRoutes, (req, res) => {
  res.send(404);
});

app.listen(process.env.port, async () => {
  try {
    connection;
    console.log(`running on port ${process.env.port}`);
  } catch (err) {
    console.log("Error: cant connect to mongodb");
  }
});
