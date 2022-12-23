import { User } from '../models/index.model.js'
import logger from '../logs/logger.js';


const save = async (user)=>{
    const objetoModel = new User(user);

    try{
        const res = await objetoModel.save();
        return res;
    }
    
    catch(err){
        logger.error("Error guardando user. Code: ", err);
        return false;
    }
}

const getByEmail = async (email)=>{
    try {
        const object = await User.findOne({ email: email }, { __v: 0 });
        
        if (object) {
            return object
        } else {
            return { error: `User de email ${email} no encontrado` }
        }
    } catch (err) {
        logger.error("Error buscando email. Code: ", err)
        return {error: "error buscando email"}
    }
}

const getById = async (id)=> {
    try {
        const object = await User.findById(id)
        
        if (object) {
            return object
        } else {
            return { error: `ID ${id} no encontrado` }
        }
    } catch (err) {
        logger.error("Error buscando id. Code: ", err)
        return {error: "error buscando id"}
    }
}

const getByUsername = async (username)=>{
    try {
        const object = await User.findOne({ username: username }, { __v: 0 });
        
        if (object) {
            return object
        } else {
            return { error: `Username ${username} no encontrado` }
        }
    } catch (err) {
        logger.error("Error buscando user. Code: ", err)
        return {error: "error buscando user"}
    }
}

export {save, getByEmail, getById, getByUsername}