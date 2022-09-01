import axios from 'axios';
import { Response } from 'express';
import { Carrera, Horario } from '../../../core/domain/models';
import { careerDataSource } from '../../../network/careersDataSource';
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

        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getSchedulesByIndex(req as CustomRequest, res)
        );

        this.router.get("/:index/:periodo",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getScheduleDetailByIndex(req as CustomRequest, res)
        );
    }

    private async getSchedulesByIndex(req: CustomRequest, res: Response) {

        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const career = req.careers[index]

            const data = await careerDataSource.getCareerSchedules(career, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const schedules = careerScrapper.getCareerSchedules(career);

            if (!schedules) {
                const error = careerScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }


            res.status(200).json(schedules)

        } catch (error: any) {

            console.error(error);

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)

        }

    }

    private async getSchedules(req: CustomRequest, res: Response) {
        try {

            const queries = req.query as any as Carrera;

            if (!queries.claveCarrera)
                return res.status(400).send("claveCarrera missing")

            if (!queries.claveDependencia)
                return res.status(400).send("claveDependencia missing")

            if (!queries.claveGradoAcademico)
                return res.status(400).send("claveGradoAcademico missing")

            if (!queries.claveModalidad)
                return res.status(400).send("claveModalidad missing")

            if (!queries.claveNivelAcademico)
                return res.status(400).send("claveNivelAcademico missing")

            if (!queries.clavePlanEstudios)
                return res.status(400).send("clavePlanEstudios missing")

            if (!queries.claveUnidad)
                return res.status(400).send("claveUnidad missing")


            const data = await careerDataSource.getCareerSchedules(queries, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const schedules = careerScrapper.getCareerSchedules(queries);

            if (!schedules) {
                const error = careerScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }

            res.status(200).json(schedules)

        } catch (error: any) {

            console.error(error);

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)

        }

    }

    private async getScheduleDetailByIndex(req: CustomRequest, res: Response) {

        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index == null)
                return res.status(400).send("Index missing")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const periodo = req.params.periodo

            if (!periodo)
                return res.status(400).send("Periodo missing")

            const horario = { ...req.careers[index] } as Horario

            horario.periodo = periodo

            const data = await careerDataSource.getScheduleDetail(horario, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const detail = careerScrapper.getScheduleDetail();

            if (!detail) {
                const error = careerScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }


            res.status(200).json(detail)

        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.sendStatus(500);
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

            const data = await careerDataSource.getScheduleDetail(queries, req.user, req.trim);

            const careerScrapper = new CareerScrapper(data);

            const detail = careerScrapper.getScheduleDetail();

            if (!detail) {
                const error = careerScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }


            res.status(200).json(detail)

        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.sendStatus(500);
        }

    }

}

export const scheduleController = new ScheduleController();
