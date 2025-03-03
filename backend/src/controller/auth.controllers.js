import { genrateToken } from '../lib/jwtToken.js';
import { UserModel } from '../model/user.model.js';
import bcrypt from 'bcryptjs'
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        //hash passwords
        if (!fullname || !email || !password) {
            res.status(400).json({ message: "All fields are required." })
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be atleast 6 characters." })
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exist please login." })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            email,
            fullname,
            password: hashedPassword
        });

        if (newUser) {
            await genrateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ message:"Invalid user data." })
        }

    } catch (error) {
        console.log("Error in signup controller:->", error.message);
        res.status(500).json({ message: "Internal server error." })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                genrateToken(user._id, res);
                res.status(200).json({
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    profilePic: user.profilePic
                })
            }
            else {
                res.status(400).json({ message: "Invalid credentials" })
            }
        } else {
            res.status(404).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        console.log("error in signin controller->", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User Loguot successfully" })
    } catch (error) {
        console.log("error in logout controller->", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in update profile controller->", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const checkUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unautorised-Token not provided" })
        }
        res.status(200).send(req.user)
    } catch (error) {
        console.log("error in check user controller->", error);
        res.status(500).json({ message: "Internal server error" })
    }
}