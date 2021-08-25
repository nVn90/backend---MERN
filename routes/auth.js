const express = require("express");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");

router.post(
  "/signup",
  // express validator MIDDLEWARE to perform a check
  [
    check("name", "Name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 char").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  // express validator MIDDLEWARE to perform a check
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

// router.get("/testroute", isSignedIn, (req, res) => {
//   res.json(req.auth);
// });

module.exports = router;
