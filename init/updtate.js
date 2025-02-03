const Listing=require("../models/listing.js");
Listing.updateMany(
    {},  // The empty object `{}` means "apply to all documents"
    { $set: { category: "farm" } }  // Set the `category` field to "Default Category"
)
.then(result => console.log("Documents updated:", result))  // Logs the result of the update
.catch(err => console.error("Error updating documents:", err));  // Handles any errors



Listing.find({})
    .then(listings => {
        console.log("All listings:", listings);
    })
    .catch(err => {
        console.error("Error fetching listings:", err);
    });
