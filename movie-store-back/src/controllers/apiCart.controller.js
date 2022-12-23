import { CartDao } from "../daos/index.dao.js";
import { CartDto } from '../dtos/index.dto.js'
import { ProductoDao } from "../daos/index.dao.js";
import logger from "../logs/logger.js";
import WSResponse from "../libs/WSResponse.js";


/* add new cart */
const postCart = async (req, res) => {
    try {
        const data = await CartDao.save({ objType: "cart" })
        res.json(new WSResponse(data, "success posting cart"))
    } catch {
        logger.error("error posting cart")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const emptyCartById = async (req, res) => {
    try {
        const data = await CartDao.emptyCartById(req.params.id);
        const cartDto = new CartDto({ _id: req.params.id, productos: data.cart.productos })

        res.json(new WSResponse(cartDto.productos, "success"))
    } catch {
        logger.error("error emptying cart")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

/* delete cart */
const deleteCartById = async (req, res) => {
    try {
        /* empty cart first */
        await CartDao.emptyCartById(req.params.id);
        const data = await CartDao.deleteById(req.params.id)

        res.json(new WSResponse(data, "success deleting cart"));
    } catch {
        logger.error("error deleting cart")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const getAllCarts = async (req, res) => {
    try {
        const data = await CartDao.getAll();
        res.json(new WSResponse(data, "success retrieving carts"));
    } catch {
        logger.error("error retrieving cart")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

/* get products from cart id */
const getAllProductsByCartId = async (req, res) => {
    try {
        const data = await CartDao.getAllByCartId(req.params.id);
        const cartDto = new CartDto({ _id: req.params.id, productos: data })

        res.json(new WSResponse(cartDto.productos, "success retrieving products from cart"))
    } catch {
        logger.error("error retrieving products from cart")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

/* add new product to cart */
const postProductByCartId = async (req, res) => {
    try {
        const producto = await ProductoDao.getById(req.params.id_prod);
        if (producto.error) {
            res.json(new WSResponse(producto, "can't find product in cart"))
        } else {
            const data = await CartDao.saveByCartId(req.params.id, producto)
            
            const cartDto = new CartDto({ _id: req.params.id, productos: data.cart.productos })

            res.json(new WSResponse(cartDto.productos, "success posting product"))
        }
    } catch (err) {
        logger.error("error posting product by cart id")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

/* delete product from cart */
const deleteProductByCartId = async (req, res) => {
    try {
        const data = await CartDao.deleteByCartId(req.params.id, req.params.id_prod);
        const cartDto = new CartDto({ _id: req.params.id, productos: data.cart.productos })

        res.json(new WSResponse(cartDto.productos, "success deleting product from cart"))
    } catch {
        logger.error("error deleting product by cart id")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}


export default { getAllCarts, getAllProductsByCartId, postProductByCartId, postCart, deleteCartById, deleteProductByCartId, emptyCartById }