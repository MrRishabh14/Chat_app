import express from 'express'
import { accessChat, getAllchats } from '../controllers/chat.controller.js';
import {auth} from "../controllers/auth.controller.js"

const router=express.Router();

router.post("/access",auth,accessChat);
router.get("/",auth,getAllchats);

export default router;