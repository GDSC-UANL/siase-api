import { InformacionAlumno } from '@siaseApi/core/domain/users';
import { Request, Response } from "express";
import { BaseController, CustomRequest } from "@siaseApi/webapi/controllers/baseController";
import { userDataSource } from '@siaseApi/network/userDataSource';
import jwt from 'jsonwebtoken'
import axios from 'axios';
import { ErrorResponse } from '@siaseApi/network/exceptions/errorResponse';

class UserController extends BaseController {


    protected config() {
        this.router.get("/",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next),
            (req, res) => this.getUser(req as CustomRequest, res))

        this.router.post("/", (req, res) => this.authUser(req, res))
    }

    async authUser(req: Request, res: Response) {
        try {
            const password = req.body.password

            const user = req.body.user

            const loginResponse = await userDataSource.loginUser(user, password);

            const userInfo: InformacionAlumno = await userDataSource.getUserInfo(
                loginResponse.carreras![0],
                user,
                loginResponse.trim!
            );


            const token = jwt.sign({
                user: user,
                name: userInfo?.nombre,
                trim: loginResponse.trim,
                careers: loginResponse.carreras,
            }, process.env.SECRET!, {
                expiresIn: "30m"
            })

            res.status(200).json({
                nombre: userInfo?.nombre,
                matricula: user,
                carreras: loginResponse.carreras,
                foto: userInfo?.foto,
                token,
            })
        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            if (error instanceof ErrorResponse)
                return res.status(error.statusCode).send(error.message)

            res.status(500).send(error.message)
        }

    }

    async getUser(req: CustomRequest, res: Response) {
        try {

            res.status(200).json({
                nombre: req.name,
                matricula: req.user,
                carreras: req.careers,
            })

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}

export const userController = new UserController();
