const User = require("../models/user");

module.exports.renderSignupForm = async (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signupUser = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!!");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =async(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.destroyUser =  async (req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err);
       }
       req.flash("success","You're logged out!");
       res.redirect("/listings");
    })
};