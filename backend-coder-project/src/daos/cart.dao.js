import { Cart } from '../models/index.model.js'
import logger from '../logs/logger.js'
import mongoose from 'mongoose'

const save = async (objeto) => {
    const objetoModel = new Cart(objeto)

    try {
        const obj = await objetoModel.save()
        return { success: `cargado con id ${obj._id}`, _id: obj._id };
    } catch (err) {
        logger.error("error guardando. Code: ", err);
    }
}

const getById = async (id) => {
    try {
        const validId = mongoose.isValidObjectId(id);
        if (validId) {
            const object = await Cart.findOne({ _id: id }, { __v: 0 });
            return (object ? object : { error: `id ${id} no encontrado` });
        } else {
            return { error: `id ${id} no encontrado` }
        }

    } catch (err) {
        logger.error("error buscando por id: ", err)
    }
}

const getAll = async () => {
    try {
        const objetos = await Cart.find({}, { __v: 0 })
        return objetos;
    } catch (err) {
        return { error: "error buscando en coleccion" };
    }
}

const deleteById = async (id) => {
    try {
        const validUserId = mongoose.isValidObjectId(id);
        if (validUserId) {
            const del = await Cart.deleteOne({ _id: id })
            return (del.deletedCount > 0 ? { success: `id ${id} eliminado` } : { error: `id ${id} no encontrado` })
        } else {
            return { error: `id ${id} no encontrado` }
        }
    } catch (err) {
        logger.error("error borrando por id: ", err)
    }
}

const getAllByCartId = async (id) => {
    const cart = await Cart.findOne({ _id: id }, { __v: 0 })
    if (cart === null) {
        return { error: `carrito de id ${id} no encontrado` }
    }
    return (cart?.productos?.length > 0 ? cart.productos : [])
}

const saveByCartId = async (cartId, producto) => {
    try {
        const objetoCart = await getById(cartId);
        if (objetoCart.error) {
            return { error: `carrito de id ${cartId} no encontrado` }
        } else {
            const prodIndex = objetoCart.productos.findIndex(item => item._id.toString() === producto._id.toString())
            
            if (prodIndex != -1) {
                objetoCart.productos[prodIndex].count++;
                
            } else {
                const prod = {...producto._doc, count: 1}
                objetoCart.productos.push(prod)
            }

            const objetoModel = new Cart(objetoCart)

            try {
                await objetoModel.save();
                return { success: `producto de id ${producto._id} agregado al cart de id ${cartId}`, cart: objetoCart }
            } catch (err) {
                logger.error("error guardando producto en carrito: ", err)
            }
        }
    } catch (err) {
        logger.error("eror guardando en carrito: ", err)
    }
}

const deleteByCartId = async (cartId, prodId) => {
    try {
        const cart = await getById(cartId)

        if (cart.error) {
            return { error: `carrito de id ${cartId} no encontrado` }
        } else {
            const productos = [] && cart.productos;
            const index = productos.findIndex(producto => producto._id == prodId);

            if (index != -1) {
                cart.productos[index].count--;

                if (cart.productos[index].count === 0) {
                    productos.splice(index, 1)
                    cart.productos = productos;
                }

                const objetoModel = new Cart(cart);
                objetoModel.isNew = false;

                try {
                    await objetoModel.save()
                    return { success: `producto de id ${prodId} eliminado del carrito de id ${cartId}`, cart }
                } catch (err) {
                    logger.error("error eliminando producto del carrito: ", err)
                }
            } else {
                return { error: `producto de id ${prodId} no encontrado en el carrito de id ${cartId}` }
            }
        }
    } catch (err) {
        logger.error("error eliminando producto del carrito: ", err)
    }
}

const emptyCartById = async (id) => {
    try {
        const cart = await getById(id);

        if (cart.error) {
            return { error: `carrito de id ${id} no encontrado` }
        } else {
            cart.productos = [];
            const objetoModel = new Cart(cart)
            try {
                await objetoModel.save();
                return { success: `carrito de id ${id} vaciado`, cart }
            } catch (err) {
                logger.error("error vaciando carrito: ", err)
            }
        }
    } catch (err) {
        logger.error("error vaciando carrito: ", err)
    }
}

export { save, getById, getAll, deleteById, getAllByCartId, saveByCartId, deleteByCartId, emptyCartById }