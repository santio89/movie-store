import passport from "passport";
import logger from "../logs/logger.js";
import WSResponse from "../libs/WSResponse.js";
import { UserDto } from '../dtos/index.dto.js'


const getLogged = (req, res) => {
    try {
        res.json(new WSResponse({ status: "ok", user: new UserDto(req.session.user) }, "success getting logged status"))
    } catch {
        logger.error("error getting logged status")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const logout = (req, res) => {
    const user = req.session.user;
    req.session.destroy((err) => {
        err ? res.json(new WSResponse({ status: "logout error", error: err }, "logout error", true, err)) : res.json(new WSResponse({ status: "ok", user: new UserDto(user) }, "success logging out"));
        return;
    })
}

const login = (req, res) => {
    passport.authenticate('login', (err, user, info) => {
        res.json(new WSResponse(info, "login auth"))
    })(req, res)
}

const register = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.json(new WSResponse({ error: "please upload a profile pic" }, "error: please upload a profile pic", true, 400))
    }
    passport.authenticate('register', (err, user, info) => {
        res.json(new WSResponse(info, "register auth"))
    })(req, res)
}


export default { getLogged, logout, login, register }