import {create} from "zustand";
import { axiosInsatance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false, 
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    
    checkAuth:async()=>{
        try {
            const res=await axiosInsatance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            console.log("Error in check auth in useAuthStore->",error);
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signUp:async(data)=>{
        try {
        set({isSigningUp:true});
        const res=await axiosInsatance.post("auth/signup",data);
        toast.success("Account created successfully.")
        set({authUser:res.data })
        get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },

    signIn:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInsatance.post("/auth/signin",data);
            toast.success("Logged In Successfully");
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try {
            await axiosInsatance.post("/auth/logout");
            set({authUser:null})
            get().disConnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res=await axiosInsatance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully.")
        } catch (error) {
            console.log("error in update profile=>",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:async()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected)return;

        const socket=io("http://localhost:3000",{
            query:{
                userId:authUser._id
            }
        });

        socket.connect(); 
        set({socket:socket})

        socket.on("getOnlineUsers",(users)=>{
            set({onlineUsers:users});
        })
        
    },

    disConnectSocket:async()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },


})) 