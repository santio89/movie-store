import express from "express";
import { pedidoController } from "../controllers/index.controller.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const { postPedido } = pedidoController;

const pedidosRouter = express.Router();


/* ruteo */
pedidosRouter.post("/:id", checkAuth, postPedido)

export default pedidosRouter;