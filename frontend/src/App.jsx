import React, { useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'
const App = () => {
 const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();

 console.log(onlineUsers);
 
 const {theme}=useThemeStore();
 useEffect(()=>{
  checkAuth();
 },[checkAuth]);

 useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme); // Apply theme globally
}, [theme]);

 if(isCheckingAuth && !authUser)return(
  <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin'/>
  </div>
 )
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser?<Home />:<Navigate to={"/signin"}/>}/>
        <Route path='/signup' element={!authUser?<SignUp />:<Navigate to={"/"}/>}/>
        <Route path='/signin' element={!authUser?<SignIn />:<Navigate to={"/"}/>}/>
        <Route path='/settings' element={<Settings />}/>
        <Route path='/profile' element={authUser?<Profile />:<Navigate to={"/signin"}/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}
export default App