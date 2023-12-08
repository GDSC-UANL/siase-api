import axios from "axios";
import { Response } from "express";
import { Carrera } from "@siaseApi/core/domain/careers";
import { afisDataSource } from "@siaseApi/network/afisDataSource";
import { AfisScrapper } from "@siaseApi/webapi/scrapper/afisScrapper";
import { BaseController, CustomRequest } from "@siaseApi/webapi/controllers/baseController";
import { gradesDataSource } from "@siaseApi/network/gradesDataSource";
import { GradesScrapper } from "@siaseApi/webapi/scrapper/gradesScrapper";
import { PeriodoCalificaciones } from "@siaseApi/core/domain/grades";

class GradesController extends BaseController {
    protected config(): void {
        this.router.get("/:index",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next),
            (req, res) => this.getGradesPeriods(req as CustomRequest, res)
        )

        this.router.get("/:index/:periodo",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res, next) => this.setCache(req, res, next, 1),
            (req, res) => this.getGradesDetail(req as CustomRequest, res)
        );
    }

    async getGradesPeriods(req: CustomRequest, res: Response) {
        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const carrera = req.careers[index] as Carrera

            const data = await gradesDataSource.getGradesPeriods(carrera, req.user, req.trim);
            const gradesScrapper = new GradesScrapper(data)

            const periodos = gradesScrapper.getPeriodos(carrera);

            if (!periodos) {
                const error = gradesScrapper.getError();
                console.error(error)
                return res.status(error.statusCode).send(error.message);
            }

            res.status(200).json(periodos)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

    async getGradesDetail(req: CustomRequest, res: Response) {
        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const periodo = req.params.periodo;

            if (!periodo)
                return res.status(400).send("Periodo missing")

            const periodoCalificacion = { ...req.careers[index] } as PeriodoCalificaciones

            periodoCalificacion.periodo = periodo

            const data = await gradesDataSource.getGradesDetail(periodoCalificacion, req.user, req.trim);
            const gradesScrapper = new GradesScrapper(data)

            const calificaciones = gradesScrapper.getGradesDetail();

            if (!calificaciones) {
                const error = gradesScrapper.getError();
                return res.status(error.statusCode).send(error.message);
            }

            res.status(200).json(calificaciones)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}

export const gradesController = new GradesController();