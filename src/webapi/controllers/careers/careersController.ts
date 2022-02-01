import { careerDataSource } from './../../../network/careersDataSource';
import { CustomRequest } from './../baseController';
import { BaseController } from "../baseController";
import { Response } from 'express';
import axios from 'axios';
import { CareerScrapper } from '../../scrapper/careerScrapper';

class CareersController extends BaseController {
    protected config(): void {
        this.router.get("/", this.verifyToken, (req, res) => this.getUserCareers(req as CustomRequest, res))
        this.router.get("/:index", this.verifyToken, (req, res) => this.getCareerDetail(req as CustomRequest, res))

    }

    async getUserCareers(req: CustomRequest, res: Response) {
        try {

            res.status(200).json(req.careers)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

    async getCareerDetail(req: CustomRequest, res: Response) {
        try {

            const rawIndex = req.params.index

            const index = Number.parseInt(rawIndex)

            if (Number.isNaN(index))
                return res.status(400).send("Invalid index")

            if (index < 0 || index >= req.careers.length)
                return res.status(400).send("Index out of bounds")

            const careers = req.careers[index]

            const userInfoResponse = await careerDataSource.getUserInfoResponse(careers, req.user, req.trim);

            const careerScrapper = new CareerScrapper(userInfoResponse)

            const userInfo = careerScrapper.getStudentInfo()

            if (userInfo == null) return res.status(400).send("An error has ocurred while gathering the information, make sure the token is still valid");

            res.status(200).json(userInfo)

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}

export const careersController = new CareersController(); 