import { createTransport } from 'nodemailer'
import logger from '../logs/logger.js'
import dontenv from 'dotenv'
dontenv.config()

/* send con ethereal */
async function sendMailEthereal(to, subject, html) {
    const ADMIN_MAIL = process.env.ETHEREALMAIL

    const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: ADMIN_MAIL,
            pass: process.env.ETHEREALPASS
        }
    })

    const mailOptions = {
        from: "Servidor Node",
        to: to,
        subject: subject,
        html: html,
    }

    try{
        await transporter.sendMail(mailOptions)
    } catch(e){
        logger.error(e)
    }
}


/* para enviar con google (default) */
async function sendMail(to, subject, html) {
    const ADMIN_MAIL = process.env.GOOGLEMAIL

    const transporter = createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: ADMIN_MAIL,
            pass: process.env.GOOGLEPASS
        }
    })

    const mailOptions = {
        from: "Servidor Node",
        to: to,
        subject: subject,
        html: html,
    }

    try{
        await transporter.sendMail(mailOptions)
    } catch(e){
        logger.error("error sending mail: ", e)
    }
}

export default sendMail;
