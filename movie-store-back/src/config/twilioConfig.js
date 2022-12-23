import twilio from 'twilio'
import logger from '../logs/logger.js'
import dontenv from 'dotenv'
dontenv.config()

const accountSid = process.env.TWILIOSID
const authToken = process.env.TWILIOTOKEN

const client = twilio(accountSid, authToken)

async function sendSms(to, body){
    const options = {
        body: body,
        from: process.env.TWILIOSMS,
        to: '+54'+to
    }

    try{
        await client.messages.create(options)
    } catch(e){
        logger.error("error sending sms: ", e)
    }
}

async function sendWsap(to, body){
    const options = {
        body: body,
        from: process.env.TWILIOWSAP,
        to: 'whatsapp:+549'+to
    }
    
    try{
        await client.messages.create(options)
    } catch(e){
        logger.error("error sending whatsapp: ", e)
    }
}

export {sendSms, sendWsap};