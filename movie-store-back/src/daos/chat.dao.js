import { Chat } from '../models/index.model.js'
import logger from '../logs/logger.js'


const save = async (mensaje) => {
    const objetoDoc = new Chat(mensaje);

    try {
        const res = await objetoDoc.save();
        return res;
    }

    catch (err) {
        logger.error("Error saving chat. Code: ", err);
        return false;
    }
}

const getAll = async () => {
    try {
        const mensajes = await Chat.find({}, { __v: 0 })
        return mensajes;
    } catch (err) {
        logger.error("Error retrieving chat. Code: ", err);
        return false;
    }
}

export { save, getAll }