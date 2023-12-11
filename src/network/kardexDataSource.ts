import { Carrera } from "@siaseApi/core/domain/careers";
import { Kardex, MateriaKardex } from "@siaseApi/core/domain/kardex";
import { SiaseNetworkDataSource } from "@siaseApi/network/siaseNetworkDataSource";
import cheerio from 'cheerio'

class KardexDataSource extends SiaseNetworkDataSource {

    async getKardex(query: Carrera, user: string, trim: string): Promise<Kardex | null> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/econkdx01.htm", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const kardex = new Kardex();

        const tables = $("table")

        const infoTable = tables.first();
        const kardexTable = $(tables[1])

        if (tables.length == 0) 
            throw this.getError($)
        

        const subjects = kardexTable.find("tr")
        const kardexInfo = infoTable.find("tr")

        const careerStudyPlan = $(kardexInfo.get(KardexInfoValues.CarreraPlanEstudios)).find("td")

        kardex.setNombreAlumnoFromvalue($(kardexInfo.get(KardexInfoValues.Nombre)).text())
        kardex.setCarreraFromValue(careerStudyPlan.first().text())
        kardex.setPlanEstudiosFromValue(careerStudyPlan.last().text())

        for (let i = 0; i < subjects.length; i++) {
            if (i == 0) continue

            const currentSubject = $(subjects[i])
            const newSubject = new MateriaKardex();

            newSubject.setSemestreFromvalue($(currentSubject.children().get(KardexSubjectValues.Semestre)).text())
            newSubject.setClaveMateriaFromValue($(currentSubject.children().get(KardexSubjectValues.Clave)).text())
            newSubject.setNombreFromValue($(currentSubject.children().get(KardexSubjectValues.Nombre)).text())

            const scores = currentSubject.children().slice(KardexSubjectValues.Calificaciones)

            let scoreNum = 0;


            for (let score of scores) {
                scoreNum++;

                const text = $(score).text().trim()
                if (!text || text == "" || text == " ") continue;

                if (scoreNum == 7)
                    newSubject.laboratorio = text
                else {
                    newSubject.oportunidades.push(text)
                }

            }

            kardex.materias.push(newSubject)

        }


        return kardex;
    }

}

enum KardexInfoValues {
    Nombre,
    CarreraPlanEstudios,

}

enum KardexSubjectValues {
    Semestre,
    Mod,
    Clave,
    Nombre,
    Calificaciones
}

export const kardexDataSource = new KardexDataSource();