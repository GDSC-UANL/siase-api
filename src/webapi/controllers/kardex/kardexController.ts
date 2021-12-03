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
    }

    private async getKardex(req: CustomRequest, res: Response) {
        try {

	    const queries = req.query as any

            if (!queries.opcion)
                res.status(400).send("Opcion missing")

	    const opcion = queries.opcion as number

	    if (opcion >= req.careers.length)
		return res.status(400).send("Opcion is out of bounds")

	    const carrera = req.careers[opcion] as Carrera

	    if (!carrera.claveCarrera)
		res.status(400).send("claveCarrera unavailable")

	    if (!carrera.claveDependencia)
		res.status(400).send("claveDependencia unavailable")

	    if (!carrera.claveGradoAcademico)
		res.status(400).send("claveGradoAcademico unavailable")

	    if (!carrera.claveModalidad)
		res.status(400).send("claveModalidad unavailable")

	    if (!carrera.claveNivelAcademico)
		res.status(400).send("claveNivelAcademico unavailable")

	    if (!carrera.clavePlanEstudios)
		res.status(400).send("clavePlanEstudios unavailable")

	    if (!carrera.claveUnidad)
		res.status(400).send("claveUnidad unavailable")

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
