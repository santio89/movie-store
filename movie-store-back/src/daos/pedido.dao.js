import { Pedido } from '../models/index.model.js'
import logger from '../logs/logger.js'

const save = async (objeto) => {
    const objetoModel = new Pedido(objeto)

    try {
        const obj = await objetoModel.save()
        return { success: `cargado con id ${obj._id}`, _id: obj._id };
    } catch (err) {
        logger.error("error guardando. Code: ", err);
    }
}

export { save }