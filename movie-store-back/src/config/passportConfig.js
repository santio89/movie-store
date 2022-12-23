import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import { Cart } from '../models/index.model.js'
import { User } from '../models/index.model.js'
import { UserDao } from '../daos/index.dao.js'
import { UserDto } from '../dtos/index.dto.js'
import sendMail from './nodemailerConfig.js'
import logger from '../logs/logger.js'
const LocalStrategy = passportLocal.Strategy

function initialize(passport) {
    const createHash = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10));

    const registerStrategy = new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        let { email, address, age, name, phone } = req.body;
        try {
            email = email.toLowerCase();
            address = address.toLowerCase();
            name = name.toLowerCase();

            const existingemail = await UserDao.getByEmail(email)

            if (!existingemail.error) {
                return done(null, null, { error: true, message: "e-mail ya existe" })
            }

            const docCart = new Cart();

            const cart = await docCart.save({ objType: "cart" })

            const newUser = {
                email,
                name,
                password: createHash(password),
                address,
                age,
                avatar: `http://${req.get("host")}/public/uploads/avatar-${email}.jpg`,
                phone,
                role: "user",
                cartId: cart._id
            }

            const docUser = new User(newUser);
            const user = await docUser.save();

            const html = `
                <h1>NUEVO REGISTRO</h1>
                <div>
                    <h2>DATOS DEL USUARIO</h2>
                    <p>e-mail: ${email}</p>
                    <p>nombre: ${name}</p>
                    <p>direccion: ${address}</p>
                    <p>edad: ${age}</p>
                    <p>telefono: ${phone}</p>
                </div>
            `

            /* enviar correo de nuevo registro a cuenta admin (ethereal) */
            sendMail("duncan.huels@ethereal.email", "Nuevo Registro", html)

            req.session.user = new UserDto({ name: user.name, email: user.email, address: user.address, age: user.age, avatar: user.avatar, phone: user.phone, role: user.role, id: user._id, cartId: cart._id });
            return done(null, null, { status: "ok", message: "Usuario registrado exitosamente", user: new UserDto({ name: user.name, email: user.email, address: user.address, age: user.age, avatar: user.avatar, phone: user.phone, role: user.role, id: user._id, cartId: cart._id }) })
        } catch (e) {
            logger.error("error en registro: ", e)
            done(null, newUser, { error: true, message: "error en registro" })
        }
    })

    const loginStrategy = new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        let { email } = req.body;
        email = email.toLowerCase();

        try {
            const user = await UserDao.getByEmail(email)

            if (user.error || !bcrypt.compareSync(password, user.password)) {
                return done(null, null, { error: true, message: "credenciales inválidas" })
            }

            req.session.user = new UserDto({ name: user.name, email: user.email, address: user.address, age: user.age, avatar: user.avatar, phone: user.phone, role: user.role, id: user._id, cartId: user.cartId });
            return done(null, user, { status: 'ok', user: new UserDto({ name: user.name, email: user.email, address: user.address, age: user.age, avatar: user.avatar, phone: user.phone, role: user.role, id: user._id, cartId: user.cartId }) })
        } catch (e) {
            console.error("error login: ", e)
            return done(null, null, { error: true, message: "error login" })
        }
    })

    passport.use('register', registerStrategy)
    passport.use('login', loginStrategy)

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.collection.findById(id, done).then(user => {
            done(null, user)
        }).catch(err => {
            done(err, null)
        });
    });
}

export default initialize