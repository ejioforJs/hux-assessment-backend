const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/createToken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name)

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 12),
    });

    const user = await newUser.save();

    if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
        //   token: generateToken(user._id),
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email })

    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            // token: generateToken(user._id),
          });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expiresIn: Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};