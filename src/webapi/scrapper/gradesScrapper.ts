import { Carrera } from '@siaseApi/core/domain/careers';
import { Calificacion, PeriodoCalificaciones } from '@siaseApi/core/domain/grades';
import { SiaseWebScrapper } from '@siaseApi/webapi/scrapper/webScrapper';
export class GradesScrapper extends SiaseWebScrapper {

    getGradesDetail(): Calificacion[] | null {

        const calificaciones: Calificacion[] = []
        const tables = this.$("table")

        if (tables.length <= 1) return null

        const calificacionesTable = this.$(tables.get(1))


        const rows = calificacionesTable.find("tr")
        let index = 0
        for (let row of rows) {

            if (index++ == 0 || index + 1 == rows.length) continue;

            const calificacion = new Calificacion();
            const infoCols = this.$(row).find("td")

            calificacion.claveMateria = this.$(infoCols.get(CalificacionesValues.clave)).text().trim()
            calificacion.nombre = this.$(infoCols.get(CalificacionesValues.nombre)).text().trim()
            calificacion.tipoInscripcion = this.$(infoCols.get(CalificacionesValues.tipoInscripcion)).text().trim()
            calificacion.grupo = this.$(infoCols.get(CalificacionesValues.grupo)).text().trim()
            calificacion.fecha = this.$(infoCols.get(CalificacionesValues.fecha)).text().trim()
            calificacion.calificacion = this.$(infoCols.get(CalificacionesValues.calificacion)).text().trim()
            calificacion.oportunidad = this.$(infoCols.get(CalificacionesValues.oportunidad)).text().trim()

            calificaciones.push(calificacion)


        }

        return calificaciones
    }

    getPeriodos(career: Carrera): PeriodoCalificaciones[] | null {
        const periodos: PeriodoCalificaciones[] = []
        const options = this.$("option")
        if (options.length == 0) return null;
        let index = 0;
        for (let option of options) {
            if (index++ == 0) continue
            const name = this.$(option).text()
            const period = this.$(option).attr("value")
            const periodo = new PeriodoCalificaciones(career, name, period);
            periodos.push(periodo)
        }

        return periodos
    }

}

enum CalificacionesValues {
    clave,
    nombre,
    tipoInscripcion,
    grupo,
    fecha,
    calificacion,
    oportunidad
}