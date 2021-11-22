import { Carrera } from '../../core/domain/models';
import { SiaseWebScrapper } from './webScrapper';
export class CareerScrapper extends SiaseWebScrapper {

    getCareersFromLoginResponse(): Carrera[] {

        const form = this.$("form[name=SelCarrera]")

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

}
