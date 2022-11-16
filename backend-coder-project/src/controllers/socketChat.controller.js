import { ChatDao } from "../daos/index.dao.js"
import { ChatDto } from '../dtos/index.dto.js'
import WSResponse from "../libs/WSResponse.js"
import logger from "../logs/logger.js"

const getAllChats = async () => {
    try {
        const data = await ChatDao.getAll()

        const chatDtos = [];
        data.forEach(chat => {
            chatDtos.push(new ChatDto(chat))
        })

        return (new WSResponse(chatDtos, "success retrieving chats"))
    } catch {
        logger.error("error retrieving chats")
        return (new WSResponse(null, "internal server error", true, 500))
    }
}

const saveChat = async (mensaje) => {
    try {
        const data = await ChatDao.save(mensaje);

        const chatDto = new ChatDto(data)

        return (new WSResponse(chatDto, "success saving chat"))
    } catch {
        logger.error("error saving chat")
        return (new WSResponse(null, "internal server error", true, 500))
    }
}

export default { getAllChats, saveChat }