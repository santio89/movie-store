import { Product } from '../models/index.model.js'
import logger from '../logs/logger.js'
import mongoose from 'mongoose'


const save = async (objeto) => {
    const objetoModel = new Product(objeto)

    try {
        const obj = await objetoModel.save()

        return obj;
    } catch (err) {
        logger.error("error guardando. Code: ", err);
    }
}

const saveById = async (id, objeto) => {
    objeto._id = id;
    const objetoModel = new Product(objeto)
    objetoModel.isNew = false;

    try {
        const obj = await objetoModel.save();

        return obj
    } catch (err) {
        logger.error("error guardando. Code: ", err);
    }
}

const getById = async (id) => {
    try {
        const validId = mongoose.isValidObjectId(id);
        if (validId) {
            const object = await Product.findOne({ _id: id }, { __v: 0 });
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
        const objetos = await Product.find({}, { __v: 0 })
        return objetos;
    } catch (err) {
        return { error: "error buscando en coleccion" };
    }
}

const getAllByCategory = async (cat) => {
    try {
        const objetos = await Product.find({ categoria: cat })
        return objetos;
    } catch {
        return { error: "error buscando en coleccion" };
    }
}

const deleteById = async (id) => {
    try {
        const validUserId = mongoose.isValidObjectId(id);
        if (validUserId) {
            const del = await Product.deleteOne({ _id: id })
            return (del.deletedCount > 0 ? { success: `id ${id} eliminado` } : { error: `id ${id} no encontrado` })
        } else {
            return { error: `id ${id} no encontrado` }
        }
    } catch (err) {
        logger.error("error borrando por id: ", err)
    }
}

const deleteAll = async () => {
    try {
        await Product.deleteMany({})
        return { success: "collecion vaciada" }
    } catch (err) {
        logger.error("error vaciando coleccion: ", err)
    }
}


export { save, saveById, getById, getAll, getAllByCategory, deleteById, deleteAll }