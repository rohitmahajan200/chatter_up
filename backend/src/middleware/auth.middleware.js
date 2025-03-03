import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.model.js";
import { config } from "dotenv";
config();
export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorised not token provided."})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            res.status(401).json({message:"Unauthorised token is invalid."})
        }
        const user=await UserModel.findById(decoded.userId).select("-password");

        if(!user){
            res.status(404).json({message:"User not found"})
        }
        req.user=user;
        next();

    } catch (error) {  
        console.log("error in auth middleware->",error);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}