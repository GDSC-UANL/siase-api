import { userController } from './controllers/users/userController';
import express, { Application } from 'express';
import cors from 'cors'
import morgan from "morgan";
import 'module-alias/register';
require('https').globalAgent.options.ca = require('ssl-root-cas').create();

class Server {

    private app: Application;

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {

        this.app.set("port", 5000)
        this.app.use(cors())
        this.app.use(morgan('dev'));
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }));

    }

    private routes() {

        this.app.use("/api/user", userController.router)

    }

    start() {
        this.app.listen(5000, () => {
            console.log("Servidor iniciado en puerto 5000")
        })
    }

}

const server = new Server()
server.start()