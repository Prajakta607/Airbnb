const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} =require("../schema.js");
const review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");





// Review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))



// reviw delete
router.delete("/:rewid",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;