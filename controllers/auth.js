const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

// Signup
exports.signup = (req, res) => {
  // validating fields
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // console.log("REQ BODY", req.body);
  // saving user data into DB
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json(user);
  });
};

// Signin

exports.signin = (req, res) => {
  // destructuring of req.body
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // finding exact One record from DB using emails
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "USER email does not exist",
      });
    }

    // Using userSchema method to authenticate the password
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password does not match",
      });
    }

    // Signing In using token (Creation of Token)
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to frontend
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// Signout
exports.signout = (req, res) => {
  // Clearing the cookie
  res.clearCookie("token");
  res.json({
    message: "user signout success",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["RS256", "sha1", "HS256"],
  userProperty: "auth",
});

// Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      err: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      err: "You are not ADMIN, Access Denied",
    });
  }
  next();
};
