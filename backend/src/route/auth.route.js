import express from 'express';
import { checkUser, logout, signin, signup, updateProfile } from '../controller/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post("/signup", signup)

router.post("/signin", signin)

router.post("/logout", logout)

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkUser)

export default router;
