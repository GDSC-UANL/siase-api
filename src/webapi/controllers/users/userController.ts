import { Request, Response } from "express";
import { BaseController } from "../baseController";
import axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import https from 'https'
import cheerio from 'cheerio'
class UserController extends BaseController {

    instance = axios.create();

    constructor() {
        super()
        this.config()
    }

    private config() {
        this.router.post("/", (req, res) => this.authUser(req, res))
    }

    async authUser(req: Request, res: Response) {
        try {
            const password = req.body.password
            const user = req.body.user
            console.log(user, password)
            const formData = new URLSearchParams()

            formData.append("HTMLUsuCve", user)
            formData.append("HTMLPassword", password)
            formData.append("HTMLPrograma", "")
            formData.append("HTMLTipCve", "01")

            const response = await axios.post("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/eselcarrera.htm", formData, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            const $ = cheerio.load(response.data)

            const form = $("form[name=SelCarrera]")

            const carreras = form.first().find("a")

            for (let carrera of carreras) {
                console.log(
                    $(carrera).text()

                )
            }




            res.send("ASDASD")
        } catch (error) {
            console.error(error)
            res.send("ERROR ")
        }

    }

}

export const userController = new UserController();