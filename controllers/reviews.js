const review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await listing.save();

    console.log("new review send");
    req.flash("success","New Review Created! ");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview=async(req,res)=>{
    let{id,rewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:rewid}})
    await review.findByIdAndDelete(rewid);
    req.flash("success","Review Deleted! ");
    res.redirect(`/listings/${id}`);
}