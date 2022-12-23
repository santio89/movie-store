import express from "express";
import { checkAuthAdmin } from "../middlewares/checkAuth.js";
import { serverinfoController } from "../controllers/index.controller.js";

const { getServerInfo } = serverinfoController;

const cartRouter = express.Router();

/* ruteo */
cartRouter.get("/", checkAuthAdmin, getServerInfo)

export default cartRouter;