    import cloudinary from "../lib/cloudinary.js";
import { getRecevierSocketId, io } from "../lib/socket.js";
    import { MessageModel } from "../model/message.model.js";
    import { UserModel } from "../model/user.model.js"
    export const getUsersForSideBar = async (req, res) => {
        try {
            const loggedInUserId = req.user._id;
            const users = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
            res.status(200).json(users);
        } catch (error) {
            console.log("error in getUsersForSideBar controller->", error);
            res.status(500).json("Internal Server Error");
        }

    }

    export const getMessages = async (req, res) => {
        try {
            const { id: userToChatId } = req.params;//getting user id of user we are goin to chat with them
            const myId = req.user._id;//userid of loggedin user
            const messages = await MessageModel.find({
                //extracting messages for user ids whome going to interact with each other
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            });
            res.status(200).json(messages)
        } catch (error) {
            console.log("error in get messages controller->", error);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    export const sendMessage = async (req, res) => {
        try {
            const { text, image } = req.body;
            const { id: receiverId } = req.params;//getting user id of user we are goin to chat with them
            const senderId = req.user._id;//userid of loggedin user
            
            let imageUrl;
            if (image && image.trim() !== "") {
            //upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            }
            

            const newMessage = new MessageModel({
                senderId, 
                receiverId, 
                text, 
                image:imageUrl
            });
            await newMessage.save();
            
            const receiverSocketId=getRecevierSocketId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage",newMessage);
            } 

        res.status(201).json(newMessage);
        } catch (error) {
            console.log("error in send message controller->", error);
            res.status(500).json({ message: "Internal server error" })
        }
    }
