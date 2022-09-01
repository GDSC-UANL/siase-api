import { Afi } from "@siaseApi/core/domain/afis";
import { SiaseWebScrapper } from "@siaseApi/webapi/scrapper/webScrapper";

export class AfisScrapper extends SiaseWebScrapper {


    getAfis(): Afi[] | null {
        const afis: Afi[] = []
        const tables = this.$(".TablaLink")

        if (tables.length == 0) return null

        const afisTable = tables.first()

        const rows = afisTable.find("tr")

        let index = 0
        for (let row of rows) {
            if (index++ == 0 || index == rows.length + 1) continue;

            const afi = new Afi();
            const infoCols = this.$(row).find("td")

            afi.setOrganizador(this.$(infoCols.get(AfiValues.organizador)).text())
            afi.setArea(this.$(infoCols.get(AfiValues.area)).text())
            afi.setEvento(this.$(infoCols.get(AfiValues.evento)).text())
            afi.setFechaHoraInicio(this.$(infoCols.get(AfiValues.fechaInicio)).text())
            afi.setFechaHoraFin(this.$(infoCols.get(AfiValues.fechaFin)).text())
            afi.setCapacidad(this.$(infoCols.get(AfiValues.capacidad)).text())
            afi.setAlumnosRegistrados(this.$(infoCols.get(AfiValues.registro)).text())
            afi.setDisponibles(this.$(infoCols.get(AfiValues.disponibles)).text())
            afi.setDescription(this.$(infoCols.get(AfiValues.evento)).attr("title"))
            afis.push(afi)
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