require("module-alias/register")
import { afisController } from '@siaseApi/webapi/controllers/afis/afisController';
import { kardexController } from '@siaseApi/webapi/controllers/kardex/kardexController';
import { userController } from '@siaseApi/webapi/controllers/users/userController';
import { scheduleController } from '@siaseApi/webapi/controllers/schedule/scheduleController';
import { careersController } from '@siaseApi/webapi/controllers/careers/careersController';
import { gradesController } from '@siaseApi/webapi/controllers/grades/gradesController';
import express, { Application } from 'express';
import cors from 'cors'
import morgan from "morgan";
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import path from 'path';
const CERT_PATH = './node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem'

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
        this.app.use("/api/afis", afisController.router)
        this.app.use("/api/grades", gradesController.router)

        this.app.use('/views', express.static(__dirname + '/views/landing/'))


        this.app.get("/", (req, res) => {

            res.sendFile(path.join(__dirname + '/views/landing/index.html'));

        })


        this.app.get("/api", (req, res) => {
            res.sendFile(path.join(__dirname + '/views/landing/index.html'));
        })
    }

    start() {
        const port = this.app.get('port')

        this.app.listen(port, () => {
            console.log("Servidor iniciado en puerto " + port)
        })
    }

}

const server = new Server()
server.start()
