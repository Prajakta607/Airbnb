const express=require("express");
const mongoose=require("mongoose");
const app=express();
const Listing=require("./models/listing.js");
const path=require("path");
const methodOvrride=require("method-override");
const ejsMate =require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOvrride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        console.log(errMsg);
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}





main()
.then(()=>{ console.log("connect to db");})
.catch((err) => {console.log(err);});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// delete
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletelist = await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listings");

}));
// create => new +create route
// new
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// create
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
 
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// update => edit+update route

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// update
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


// show// read
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))


// list
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="somthing went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
   // res.status(statusCode).send(message);
})

app.listen(3002,()=>{
    console.log("server is listening to port 3002");
});