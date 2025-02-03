const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const User=require("./user.js");
const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
       url:String,
       filename:String        
    },
    
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    latitude: {
        type: Number, // Store latitude
    },
    longitude: {
        type: Number, // Store longitude
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    category: { 
        type: String,  // New category field
        required: true, // Make it mandatory if needed
        enum: ["Trending", "Farms", "Beach", "City", "Luxury"], // Define allowed categories
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});


const Listing = mongoose.model("Listing", listingSchema);

// // MongoDB Atlas Connection String (replace with your actual connection string)
// const mongoURI = "mongodb+srv://giteprajakta61:LcPvUK96mbUaGQBr@cluster0.2ffzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Connect to MongoDB Atlas
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 30000,  // Timeout after 30 seconds if the server is not reachable
// })
// .then(() => {
//     console.log('Connected to MongoDB Atlas');
    
//     // Perform the update operation after successful connection
//     updateListings();
// })
// .catch(err => {
//     console.error('Error connecting to MongoDB Atlas:', err);
// });

// // Function to update listings
// const updateListings = () => {
//     Listing.updateMany(
//         {},  // Empty filter: update all documents
//         { $set: { category: 'farms' } },  // Set a default value for category
//         { multi: true }  // Update multiple documents
//     )
//     .then(result => {
//         console.log('Documents updated:', result);
//     })
//     .catch(err => {
//         console.error('Error updating documents:', err);
//     });
// };



module.exports = Listing;
