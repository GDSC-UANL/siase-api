import { Response } from 'express';
import { Carrera, Horario } from '../../../core/domain/models';
import { careerDataSource } from '../../../network/careersDatSource';
import { CareerScrapper } from '../../scrapper/careerScrapper';
import { BaseController, CustomRequest } from './../baseController';
class ScheduleController extends BaseController {

    protected config(): void {
        this.router.get("/",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getSchedules(req as CustomRequest, res)
        );

        this.router.get("/detail",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getScheduleDetail(req as CustomRequest, res)
        );
    }

    private async getSchedules(req: CustomRequest, res: Response) {
        try {

            const queries = req.query as any as Carrera;

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


            const data = await careerDataSource.getCareerSchedules(queries, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const schedules = careerScrapper.getCareerSchedules(queries);

            if (!schedules)
                return res.sendStatus(404)

            res.status(200).json(schedules)

        } catch (error: any) {

            console.error(error);
            res.status(500).send(error.message)

        }

    }

    private async getScheduleDetail(req: CustomRequest, res: Response) {

        try {


            const queries = req.query as any as Horario;

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

            if (!queries.periodo)
                res.status(400).send("periodo missing")

            if (!queries.resill)
                res.status(400).send("resill missing")


            const data = await careerDataSource.getScheduleDetail(queries, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const detail = careerScrapper.getScheduleDetail();

            if (!detail)
                return res.sendStatus(404)

            res.status(200).json(detail)

        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }

    }

}

export const scheduleController = new ScheduleController();