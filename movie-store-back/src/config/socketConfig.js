import normalizeMensajes from '../utils/normalize.js'
import logger from '../logs/logger.js'
import { Server as IOServer } from 'socket.io'
import { chatController } from '../controllers/index.controller.js'

export const socketConfig = (expressServer) => {
    /* start socket io - chat server */
    const io = new IOServer(expressServer, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        }
    });
    io.on("connection", async socket => {
        logger.info("Nuevo usuario conectado")

        const mensajes = await chatController.getAllChats();

        /* normalizo los mensajes del array antes de mandar al front. */
        const normalizedMensajes = mensajes.data/* normalizeMensajes(mensajes.data) */;

        socket.on("client:logged", async () => {
            socket.emit("server:mensajes", { mensajes: normalizedMensajes })
        })

        socket.on("client:mensaje", async mensajeEnvio => {
            const savedMessage = await chatController.saveChat(mensajeEnvio);
            io.emit("server:mensaje", savedMessage.data);
        })

        /* errores del back en requests los manejo con try/catch y se muestran por consola en front. para errores no manejados, los mando con socket y se muestran en front con un modal y el detalle */
        process.on('uncaughtException', (error) => {
            socket.emit("server: uncaughtException", error)
        });
    })
}