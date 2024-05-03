const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/createToken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 12),
    });

    const user = await newUser.save();

    user.password = undefined;

    createToken(newUser, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal server error`,
    });
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

    const user = await User.findOne({ email }).select("+password");

    if (user && bcrypt.compareSync(password, user.password)) {
      createToken(user, 200, res);
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

exports.protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    console.log("JWT Secret:", process.env.JWT_SECRET);
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
      (err, payload) => {
        if (err) {
          const message =
            err.name === "jwt.JsonWebTokenError" ? "Unauthorized" : err.message;
          return next(createError.Unauthorized(message));
        }
        req.payload = payload;
        next();
      }
    );

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // console.log(`Token to Verify: ${decoded}`);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "failed",
        message: "The user account belonging to this token no longer exists.",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "failed",
        message: "User recently changed password. Please log in again",
      });
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};