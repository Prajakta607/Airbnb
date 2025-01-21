const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
        email:{
            type:String,
            required:true
        },
        

})                                                                                        

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
// passport-local-mongoose automatically add username  and password and salt hash function and store to database