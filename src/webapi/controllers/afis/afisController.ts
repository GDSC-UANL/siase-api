import axios from "axios";
import { Response } from "express";
import { Carrera } from "@siaseApi/core/domain/careers";
import { afisDataSource } from "@siaseApi/network/afisDataSource";
import { AfisScrapper } from "@siaseApi/webapi/scrapper/afisScrapper";
import { BaseController, CustomRequest } from "@siaseApi/webapi/controllers/baseController";

class AfisController extends BaseController {
    protected config(): void {
        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getCareerAfisByIndex(req as CustomRequest, res)
        )
    }

    async getCareerAfisByIndex(req: CustomRequest, res: Response) {
        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const carrera = req.careers[index] as Carrera

            const data = await afisDataSource.getAfisFromCareer(carrera, req.user, req.trim);

            const afisScrapper = new AfisScrapper(data)

            const afis = afisScrapper.getAfis();

            if (!afis) {
                const error = afisScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }

            res.status(200).json(afis)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}