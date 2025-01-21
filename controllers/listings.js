const Listing=require("../models/listing.js");

const axios = require('axios');
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error"," Listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderNewForm= (req,res)=>{
   
    res.render("listings/new.ejs");
}
module.exports.createListing =async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

   const location = req.body.listing.location;
   console.log('Location:', location); // Log the location to verify


    // Call Geoapify API to get coordinates
    const geoapifyApiKey = '8a458a2940b246c2b5d35619a71259ed'; // Replace with your actual Geoapify API key
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${geoapifyApiKey}`;
    
    try {
        const response = await axios.get(geocodeUrl);
        console.log('Geoapify API Response:', response.data);

        // Check if the response contains geocoding results
        if (response.data.features && response.data.features.length > 0) {
            const firstResult = response.data.features[0].geometry; // Get geometry from the first feature
            newListing.latitude = firstResult.coordinates[1]; // Latitude is in coordinates[1]
            newListing.longitude = firstResult.coordinates[0]; // Longitude is in coordinates[0]
        } else {
            req.flash('error', 'No geocoding results found for the provided location');
            return res.redirect('back');
        }

        // Save the new listing to the database
        await newListing.save();
        req.flash('success', 'New Listing Created!');
        res.redirect('/listings');
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        req.flash('error', 'Error creating listing. Please try again.');
        res.redirect('back');
    }
}


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error"," Listing Does Not Exist!");
        res.redirect("/listings");
    }
   


    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250,c_fill");
   
    res.render("listings/edit.ejs", { listing, originalImgUrl });
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing= await  Listing.findByIdAndUpdate(id,{...req.body.listing});

   if( typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
   }
    req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletelist = await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");

}