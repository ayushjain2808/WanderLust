const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const UserRouting = require("../routes/user.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController= require("../controllers/user.js");


//SignUP
router.get("/signup",userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signupUser));


//Login
router.get("/login",wrapAsync(userController.renderLoginForm));

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true,
}) , wrapAsync(userController.loginUser));


//Logout
router.get("/logout",userController.destroyUser)
module.exports = router;