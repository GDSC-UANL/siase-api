import { kardexDataSource } from '@siaseApi/network/kardexDataSource';
import { Response } from "express";
import { Carrera } from "@siaseApi/core/domain/careers";
import { BaseController, CustomRequest } from "@siaseApi/webapi/controllers/baseController";
import axios from 'axios'
import { ErrorResponse } from '@siaseApi/network/exceptions/errorResponse';
class KardexController extends BaseController {
    protected config(): void {

        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next, 2),
            (req, res) => this.getKardexByIndex(req as CustomRequest, res))
    }


    private async getKardexByIndex(req: CustomRequest, res: Response) {
        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const carrera = req.careers[index] as Carrera

            const data = await kardexDataSource.getKardex(carrera, req.user, req.trim);

            res.status(200).json(data)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            if (error instanceof ErrorResponse)
                return res.status(error.statusCode).send(error.message)

            res.status(500).send(error.message)
        }
    }

}

export const kardexController = new KardexController();
