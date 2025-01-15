const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: {
            filename: { type: String, default: "defaultImage" },
            url: { type: String, default: "https://plus.unsplash.com/premium_photo-1728732954838-f1a7ec7fce46?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        },
        default: {
            filename: "defaultImage",
            url: "https://plus.unsplash.com/premium_photo-1728732954838-f1a7ec7fce46?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Ensure this is a valid direct image URL
        }
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
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
