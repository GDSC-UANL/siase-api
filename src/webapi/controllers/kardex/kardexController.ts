import { KardexScrapper } from './../../scrapper/kardexScrapper';
import { kardexDataSource } from './../../../network/kardexDataSource';
import { Response } from "express";
import { Carrera, Horario } from "../../../core/domain/models";
import { BaseController, CustomRequest } from "../baseController";

class KardexController extends BaseController {
    protected config(): void {
        this.router.get("/", this.verifyToken, (req, res) => this.getKardex(req as CustomRequest, res))
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

            res.status(200).send(kardex)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }

}

export const kardexController = new KardexController();