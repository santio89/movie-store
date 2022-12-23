import express from "express";
import upload from "../config/multerConfig.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { userController } from "../controllers/index.controller.js";
import dotenv from 'dotenv'
dotenv.config()
const userRouter = express.Router();

const {getLogged, logout, login, register} = userController;

/* ruteo */
userRouter.get("/logged", checkAuth, getLogged)

userRouter.get("/logout", logout)

userRouter.post("/login", login)

userRouter.post("/register", upload.single("avatar"), register)


export default userRouter;