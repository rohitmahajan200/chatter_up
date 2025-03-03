import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const genrateToken=async(userId,res)=>{
const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d",
});
res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true, // this token not accesible by javascript
    sameSite:"strict",
    secure:false
});

return token;
}