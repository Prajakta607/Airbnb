if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const Listing=require("./models/listing.js");
const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const methodOvrride=require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const multer =require("multer");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listing.js");

const reviewsRouter=require("./routes/review.js");

const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOvrride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));


const dburl=process.env.ATLASDB_URL;

main()
.then(()=>{ console.log("connect to db");})
.catch((err) => {console.log(err);});



async function main() {
  await mongoose.connect(dburl);
}

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,

})
store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
})

const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/filter-listings", (req, res) => {
    console.log("Request received for filter-listings");

    const filterType = req.query.filter || "Trending";  // Default to "Trending" if no filter is provided
    console.log("Filter Type:", filterType);

    Listing.find({ category: filterType })
        .then(filteredListings => {
            console.log("Filtered Listings:", filteredListings);
            res.render("views/listings/index.ejs", { filteredListings });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching filtered listings");
        });
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
   // res.status(statusCode).send(message);
})





app.listen(3002,()=>{
    console.log("server is listening to port 3002");
});