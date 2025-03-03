import { create } from "zustand";
import { axiosInsatance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true});
        try {
            const res=await axiosInsatance.get("/messages/users");
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message);   
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosInsatance.get(`/messages/${userId}`)
            set({messages:res.data})
        } catch (error) { 
            toast.error(error.response.data.message); 
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessages:async(messageData)=>{
        console.log("message data ",messageData);
        
        const{selectedUser,messages}=get();
        try {
        const res=await axiosInsatance.post(`/messages/send/${selectedUser._id}`,messageData);        
        set({messages:[...messages,res.data]});    
        } catch (error) {
        console.log("issue in send message hook ",error);
        toast.error(error.response.data.message);
        }
    },
    suscribeToMessages:async()=>{
        const {selectedUser} =get()
    },
    setSelectedUser:async(user)=>set({selectedUser:user})
}))