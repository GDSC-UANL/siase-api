import { Carrera } from '@siaseApi/core/domain/careers';
import { Calificacion, PeriodoCalificaciones } from '@siaseApi/core/domain/grades';
import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';
import cheerio from 'cheerio'

class GradesDataSource extends SiaseNetworkDataSource {


    async getGradesPeriods(career: Carrera, user: string, trim: string): Promise<PeriodoCalificaciones[]> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", career.claveCarrera!)
        formData.append("HTMLCve_Dependencia", career.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", career.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", career.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", career.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", career.clavePlanEstudios!)
        formData.append("HTMLtrim", trim!)
        formData.append("HTMLCve_Unidad", career.claveUnidad!)
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/econcfs01.htm", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const periodos: PeriodoCalificaciones[] = []
        const options = $("option")
        if (options.length == 0) throw this.getError($);
        let index = 0;
        for (let option of options) {
            if (index++ == 0) continue
            const name = $(option).text()
            const period = $(option).attr("value")
            const periodo = new PeriodoCalificaciones(career, name, period);
            periodos.push(periodo)
        }

        return periodos
    }


    async getGradesDetail(query: PeriodoCalificaciones, user: string, trim: string): Promise<Calificacion[]> {
        const formData = new URLSearchParams()
        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", trim!)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLTipCve", "01")
        formData.append("HTMLResill", "83747")
        formData.append("HTMLPeriodo", query.periodo!)
        formData.append("HTMLTrund", "econcfs02")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/control.p", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const calificaciones: Calificacion[] = []
        const tables = $("table")

        if (tables.length <= 1) throw this.getError($)

        const calificacionesTable = $(tables.get(1))


        const rows = calificacionesTable.find("tr")
        let index = 0
        for (let row of rows) {

            if (index++ == 0 || index + 1 == rows.length) continue;

            const calificacion = new Calificacion();
            const infoCols = $(row).find("td")

            calificacion.claveMateria = $(infoCols.get(CalificacionesValues.clave)).text().trim()
            calificacion.nombre = $(infoCols.get(CalificacionesValues.nombre)).text().trim()
            calificacion.tipoInscripcion = $(infoCols.get(CalificacionesValues.tipoInscripcion)).text().trim()
            calificacion.grupo = $(infoCols.get(CalificacionesValues.grupo)).text().trim()
            calificacion.fecha = $(infoCols.get(CalificacionesValues.fecha)).text().trim()
            calificacion.calificacion = $(infoCols.get(CalificacionesValues.calificacion)).text().trim()
            calificacion.oportunidad = $(infoCols.get(CalificacionesValues.oportunidad)).text().trim()

            calificaciones.push(calificacion)


        }

        return calificaciones

    }
}

export const gradesDataSource = new GradesDataSource()

enum CalificacionesValues {
    clave,
    nombre,
    tipoInscripcion,
    grupo,
    fecha,
    calificacion,
    oportunidad
}