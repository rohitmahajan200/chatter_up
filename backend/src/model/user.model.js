import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:"",
    }
},{timestamps:true})

export const UserModel=mongoose.model("User",userSchema)