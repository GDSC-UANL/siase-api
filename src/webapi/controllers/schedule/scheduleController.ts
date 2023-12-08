import axios from 'axios';
import { Response } from 'express';
import { Horario } from '@siaseApi/core/domain/careers';
import { careerDataSource } from '@siaseApi/network/careersDataSource';
import { CareerScrapper } from '@siaseApi/webapi/scrapper/careerScrapper';
import { BaseController, CustomRequest } from '@siaseApi/webapi/controllers/baseController';
class ScheduleController extends BaseController {

    protected config(): void {

        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next),
            (req, res) => this.getSchedulesByIndex(req as CustomRequest, res)
        );

        this.router.get("/:index/:periodo",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next),
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
                console.error(error)
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



}

export const scheduleController = new ScheduleController();
