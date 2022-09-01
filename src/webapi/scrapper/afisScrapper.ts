import { Afi } from "@siaseApi/core/domain/afis";
import { SiaseWebScrapper } from "@siaseApi/webapi/scrapper/webScrapper";

export class AfisScrapper extends SiaseWebScrapper {

    getAfis(): Afi[] {

        const afis: Afi[] = []
        const tables = this.$(".TablaLink")
        const afisTable = tables.first()

        const rows = afisTable.find("tr")

        let index = 0
        for (let row of rows) {
            if (index == 0 || index + 1 == rows.length) continue;

            const afi = new Afi();
            const infoCols = this.$(row).find("td")

            afi.organizador = this.$(infoCols.get(AfiValues.organizador)).text()

            afis.push(afi)


            index++
        }

        return afis
    }

}

enum AfiValues {
    organizador = 1,
    area,
    evento,
    fechaInicio,
    fechaFin,
    capacidad,
    registro,
    disponibles
}