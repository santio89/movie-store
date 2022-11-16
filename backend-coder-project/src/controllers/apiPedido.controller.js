import { PedidoDao } from "../daos/index.dao.js";
import { PedidoDto } from "../dtos/index.dto.js";
import { CartDao } from "../daos/index.dao.js";
import logger from "../logs/logger.js";
import sendMail from "../config/nodemailerConfig.js";
import { sendSms, sendWsap } from "../config/twilioConfig.js";
import WSResponse from "../libs/WSResponse.js";
import dontenv from 'dotenv'
dontenv.config()


const postPedido = async (req, res) => {
    const pedido = {
        user: {
            userId: req.params.id,
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
        },
        orden: {
            productos: req.body.productos,
            totalItems: req.body.totalItems,
            total: req.body.total,
            cartId: req.body.cartId
        }
    }

    const htmlMail = `
        <h1 style="color: navy">COMPRA REALIZADA!!</h1>
        <h2>Datos del comprador</h2>
        <div>
            <p>E-Mail: ${pedido.user.email}</p>
            <p>Nombre: ${pedido.user.name}</p>
            <p>Dirección: ${pedido.user.address}</p>
        </div>
        <div>
            <h3 style="color: navy">PRODUCTOS</h3>
            <div>${JSON.stringify(pedido.orden.productos)}</div>
            <h3 style="color: navy">TOTAL</h3>
            <div>${pedido.orden.totalItems} items - $${pedido.orden.total}</div>
        </div>
    `

    try {
        const pedidoRespuesta = await PedidoDao.save(pedido);
        if (pedidoRespuesta.success) {
            await CartDao.emptyCartById(pedido.orden.cartId)

            const pedidoDto = new PedidoDto(pedido, pedidoRespuesta._id)

            res.json(new WSResponse({ success: "pedido cargado correctamente", pedido: pedidoDto }, "pedido cargado correctamente"))

            /* enviar mensajes confirmando compra (mail a admin/comprador. sms/wsap a comprador */
            await sendMail(process.env.GOOGLEMAIL, `Nuevo pedido de ${pedido.user.name} (${pedido.user.email})`, htmlMail)

            await sendMail(pedido.user.email, `Nuevo pedido de ${pedido.user.name} (${pedido.user.email})`, htmlMail)

            await sendSms(pedido.user.phone, `Nuevo pedido de ${pedido.user.name} (${pedido.user.email})`)

            await sendWsap(pedido.user.phone, `Nuevo pedido de ${pedido.user.name} (${pedido.user.email})`)
        } else {
            res.json({ error: "no se pudo cargar el pedido" })
        }
    } catch (err) {
        logger.error(`(USER ${req.params.id}) Error guardando en carro: `, err)
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}


export default { postPedido }