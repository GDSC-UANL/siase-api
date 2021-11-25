import { CareerQuery } from './../../core/domain/models';
import { Carrera, Schedule } from '../../core/domain/models';
import { SiaseWebScrapper } from './webScrapper';
export class CareerScrapper extends SiaseWebScrapper {

    getCareersFromLoginResponse(): Carrera[] {

        const form = this.$("form[name=SelCarrera]")

        if (form == null)
            throw new Error("Careers not found");

        const carreras = form.first().find("a")

        const parsedCarreras: Carrera[] = []

        for (let carrera of carreras) {

            const parsedCarrera = this.$(carrera);

            const name = parsedCarrera.text();
            const urlData = parsedCarrera.attr("href")

            if (!urlData) continue;

            parsedCarreras.push(new Carrera(urlData, name))

        }

        return parsedCarreras;

    }

    getCareerSchedules(career: CareerQuery): Schedule[] {

        const schedules = this.$("option")
        const resill = this.$("[name=HTMLResill]").attr("value")

        if (!resill)
            throw new Error("Token expired")

        const parsedSchedules: Schedule[] = []

        for (let schedule of schedules) {

            const parsedSchedule = this.$(schedule);
            const value = parsedSchedule.attr("value")

            if (!value || value == "0")
                continue;

            parsedSchedules.push(new Schedule(career, parsedSchedule.text(), value, resill))

        }

        return parsedSchedules;

    }

}
