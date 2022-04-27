import { kardexController } from './controllers/kardex/kardexController';
import { userController } from './controllers/users/userController';
import express, { Application } from 'express';
import cors from 'cors'
import morgan from "morgan";
import dotenv from 'dotenv'
import { scheduleController } from './controllers/schedule/scheduleController';
import fs from 'fs'
import https from 'https'
import { careersController } from './controllers/careers/careersController';

const CERT_PATH = './node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem'
const path = require('path');

class Server {

    private app: Application;

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        https.globalAgent.options.ca = fs.readFileSync(CERT_PATH);
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
        this.app.use("/api/kardex", kardexController.router)
        this.app.use("/api/careers", careersController.router)
        this.app.get("/", (req, res) => {
            res.send("SIASE API")
        })
        this.app.get("/api", (req,res) => {
            res.sendFile(path.join(__dirname+'/views/landing/index.html'));
        })
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