import { Router } from "express";
import userRouter from "./apiUser.routes.js";
import productRouter from "./apiProduct.routes.js";
import cartRouter from "./apiCart.routes.js";
import pedidosRouter from "./apiPedido.routes.js";
import serverinfoRouter from "./apiServerinfo.routes.js";
import { graphqlHTTP } from "express-graphql";
import productSchema from "./graphql/product.schema.js";
import {ProductoDao} from '../daos/index.dao.js'

const router = Router();

router.use("/user", userRouter)
router.use("/productos", productRouter)
router.use("/cart", cartRouter)
router.use("/pedidos", pedidosRouter)
router.use("/serverinfo", serverinfoRouter)


/* graphql test */
router.use("/graphql", graphqlHTTP({
    schema: productSchema,
    rootValue: {
      getProduct: ProductoDao.getById,
      getProducts: ProductoDao.getAll,
      createProduct: ProductoDao.save,
      updatePersona: ProductoDao.saveById,
      deletePersona: ProductoDao.deleteById,
    },
    graphiql: true,
  }))

export default router;