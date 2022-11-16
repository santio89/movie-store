import express from "express";
import { productController } from "../controllers/index.controller.js";
import { checkAuth, checkAuthAdmin } from "../middlewares/checkAuth.js";

const { getProductById, postProduct, putProduct, deleteProductById, getProductsByCategory } = productController;

const productRouter = express.Router();


/* ruteo */
productRouter.get("/:id?", checkAuth, getProductById)
productRouter.post("/", checkAuthAdmin, postProduct)
productRouter.put("/:id", checkAuthAdmin, putProduct)
productRouter.delete("/:id", checkAuthAdmin, deleteProductById)
productRouter.get("/category/:category", checkAuth, getProductsByCategory)

export default productRouter;