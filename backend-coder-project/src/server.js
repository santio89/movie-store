import express from "express"
import router from './routes/index.routes.js'
import logger from './logs/logger.js'
import config from './config/config.js'
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import initializePassportConfig from './config/passportConfig.js'
import compression from "compression"
import MongoStore from 'connect-mongo'
import mongoose from "mongoose"
import cluster from 'cluster'
import os from 'os'
import cors from 'cors'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { socketConfig } from './config/socketConfig.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = config.port || 8080;
const app = express();

if (config.mode === "cluster" && cluster.isPrimary) {
    os.cpus().map(() => {
        cluster.fork();
    })

    cluster.on("exit", worker => {
        logger.info(`Worker ${worker.process.pid} died. A new one is being created.`)
        cluster.fork();
    })
} else {
    /* cors */
    app.use(cors({
        origin: "*",
        credentials: true,
    }))

    /* serve static files */
    app.use("/public", express.static(path.join(__dirname, "../public")))

    /* view engine */
    app.set("view engine", "ejs")

    /* post url encode */
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    /* compression */
    app.use(compression())

    /* cookies / session */
    const mongoStoreOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    app.use(cookieParser())
    app.use(session({
        store: MongoStore.create({
            mongoUrl:
                config.mongoconnect,
            mongoStoreOptions,
        }),
        secret: config.sessionsecret,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        },
        rolling: true
    }))

    /* passport init */
    app.use(passport.initialize())
    app.use(passport.session())
    initializePassportConfig(passport)

    /* all routes - log method */
    app.use((req, res, next) => {
        logger.info(`New request: ${req.method} - ${req.path}`)
        next()
    })

    /* routes main */
    app.use("/api", router)

    /* not found */
    app.use((req, res) => {
        res.status(404).json({ error: -2, descripcion: `Ruta '${req.path}' Método '${req.method}' - No Implementada` });
    })

    // error handler
    app.use(function (err, req, res, next) {
        res.status(500).json({
            error: err.message,
        });
    });

    /* connect db */
    mongoose.connect(config.mongoconnect).then(() => {
        logger.info("Conexión establecida con Mongo");

        /* start server */
        const expressServer = app.listen(port, (err) => {
            if (!err) {
                config.mode === "cluster" ? logger.info(`[MODE: CLUSTER] El servidor se inicio en el puerto ${port}`) : logger.info(`[MODE: FORK] El servidor se inicio en el puerto ${port}`)

                /* close db on exit */
                process.on("exit", () => {
                    mongoose.disconnect().then(() => {
                        logger.info("Conexión cerrada con Mongo")
                    });
                })

            } else {
                logger.info(`Hubo un error al iniciar el servidor: `, err)
            }
        })

        /* start socket io - chat server */
        socketConfig(expressServer)

    }).catch(error => logger.error("error conectado a db: ", error));
}