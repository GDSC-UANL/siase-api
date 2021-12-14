import { KardexScrapper } from './../../scrapper/kardexScrapper';
import { kardexDataSource } from './../../../network/kardexDataSource';
import { Response } from "express";
import { Carrera } from "../../../core/domain/models";
import { BaseController, CustomRequest } from "../baseController";
import axios from 'axios'
class KardexController extends BaseController {
    protected config(): void {
        this.router.get("/",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getKardex(req as CustomRequest, res))

        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getKardexByIndex(req as CustomRequest, res))
    }

    private async getKardex(req: CustomRequest, res: Response) {
        try {

            const queries = req.query as any as Carrera

            if (!queries.claveCarrera)
                res.status(400).send("claveCarrera missing")

            if (!queries.claveDependencia)
                res.status(400).send("claveDependencia missing")

            if (!queries.claveGradoAcademico)
                res.status(400).send("claveGradoAcademico missing")

            if (!queries.claveModalidad)
                res.status(400).send("claveModalidad missing")

            if (!queries.claveNivelAcademico)
                res.status(400).send("claveNivelAcademico missing")

            if (!queries.clavePlanEstudios)
                res.status(400).send("clavePlanEstudios missing")

            if (!queries.claveUnidad)
                res.status(400).send("claveUnidad missing")

            const data = await kardexDataSource.getKardexResponse(queries, req.user, req.trim);

            const kardexScrapper = new KardexScrapper(data)

            const kardex = kardexScrapper.getKardex();

            if (!kardex)
                return res.sendStatus(404)

            res.status(200).json(kardex)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

    private async getKardexByIndex(req: CustomRequest, res: Response) {
        try {

            const index = req.params.index

            if (!Number.parseInt(index))
                return res.status(400).send("Invalid index")

            if (index == null)
                return res.status(400).send("Index missing")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const carrera = req.careers[index] as Carrera

            const data = await kardexDataSource.getKardexResponse(carrera, req.user, req.trim);

            const kardexScrapper = new KardexScrapper(data)

            const kardex = kardexScrapper.getKardex();

            if (!kardex)
                return res.sendStatus(404)

            res.status(200).json(kardex)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}

export const kardexController = new KardexController();
