const mongoose = require("mongoose");
const { applyTimestamps } = require("./video.model");

const UserSchema= new mongoose.Schema(

    {
        name:{
            type:String,
            required:true,
        },
        emailId:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            Enum:["user","admin"],
            default:"user"
        },
        plan:{
            type:String,
            enum:["limited","unlimited"],
            default:"limited"
        },
    },
    {timestamps:true}

);

const Users=mongoose.model("Users",UserSchema);

module.exports = Users;