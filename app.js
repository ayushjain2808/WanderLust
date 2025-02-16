if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const Joi = require('joi');
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const User = require("./models/user.js");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

const dbUrl = process.env.ATLASDB_URL;

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  secret: process.env.SECRET,
  touchAfter: 24*60*60
});

store.on("error",()=>{
  console.log("Error occured", err);
});


app.use(session({
    store,
    secret:"mySecretString",
    resave:false,
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true, //Secuirity Purpose (Cross-Scripting attacks)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cookieParser("secretcode"));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs',ejsMate);

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));

main()
 .then(()=>{
    console.log("connected to DB");
 })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(dbUrl);
}
  
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user||null;
  next();
})


app.get("/check-user", (req, res) => {
  res.send(req.user);
});

app.get("/debug-session", (req, res) => {
  res.send(req.session);
});


// app.get("/demouser", async (req,res)=>{
//   let fakeUser = new User({
//     email:"ayush1@gmail.com",
//     username:"AyushJain",
//   });

//   let registeredUser =await User.register(fakeUser,"12345");
//   res.send(registeredUser);
// })


//LISTINGS
app.use("/listings",listingsRouter);

//REVIEW
app.use("/listings/:id/reviews",reviewsRouter);

//USER
app.use("/",userRouter);

//ERROR MIDDLEWARE
app.use("*",(req,res,next)=>{
  next(new ExpressError(404,"Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=401,message="mai galat nhi hu"}=err;
  res.status(statusCode).render("listings/error.ejs",{err});
});

// app.get("/testListing", async (req,res)=>{
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: "1200",
//     location: "Calangute,Goa",
//     country: "India",
//   });

//   await sampleListing.save(); 
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});