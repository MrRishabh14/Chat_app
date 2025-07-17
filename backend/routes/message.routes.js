import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller";
import {auth} from "../controllers/auth.controller.js"
const router=express.Router();

router.post("/", auth,sendMessage);
router.get("/:chatId",auth,getMessage);