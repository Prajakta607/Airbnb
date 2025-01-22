const User =require("../models/user.js");

module.exports.SignUpForm=(req,res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.SignUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newuser= new User({email,username});
        const registeredUser=await User.register(newuser,password);
        console.log(registeredUser);
        req.logIn(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success"," welcome to wanderlust !");
            res.redirect("/listings");
        })
       
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
}

module.exports.loginForm=(req, res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.Logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are  LogOut !");
        res.redirect("/listings");
    })

}




