import { userController } from './controllers/users/userController';
import express, { Application } from 'express';
import cors from 'cors'
import morgan from "morgan";
import dotenv from 'dotenv'
import { scheduleController } from './controllers/schedule/scheduleController';

class Server {

    private app: Application;

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        dotenv.config();
        this.app.set("port", process.env.PORT || 5000)
        this.app.use(cors())
        this.app.use(morgan('dev'));
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }));

    }

    private routes() {

        this.app.use("/api/user", userController.router)
        this.app.use("/api/schedules", scheduleController.router)

    }

    start() {
        const port = this.app.get('port')

        this.app.listen(port, () => {
            console.log("Servidor iniciado en puerto 5000")
        })
    }

}

const server = new Server()
server.start()