const express=require("express");
const router=express.Router();


const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer =require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


// delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// create => new +create route
// new
router.get("/new",isLoggedIn,listingController.renderNewForm)

// create
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


// update => edit+update route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// update
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing));


// show// read
router.get("/:id",wrapAsync(listingController.showListing));


// list index route
router.get("/",wrapAsync(listingController.index));

module.exports=router;