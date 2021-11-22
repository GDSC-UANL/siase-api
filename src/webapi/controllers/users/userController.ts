import { CareerScrapper } from '../../scrapper/careerScrapper';
import { Request, Response } from "express";
import { BaseController } from "../baseController";
import axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import https from 'https'
import cheerio from 'cheerio'
import { userDataSource } from '../../../network/userDataSource';
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

            const loginResponse = await userDataSource.loginUser(user, password);

            const careerScrapper = new CareerScrapper(loginResponse);

            const careers = careerScrapper.getCareersFromLoginResponse()

            res.status(200).json(careers)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }

    }

}

export const userController = new UserController();