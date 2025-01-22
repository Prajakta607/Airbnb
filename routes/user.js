const express=require("express");
const router=express.Router();
const User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");


const userController=require("../controllers/users.js");

router.get("/signup",userController.SignUpForm);
router.post("/signup",userController.SignUp);


router.get("/login",userController.loginForm);

router.get("",userController.loginForm);


router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.login
    )


router.get("/logout",userController.Logout);

module.exports=router;