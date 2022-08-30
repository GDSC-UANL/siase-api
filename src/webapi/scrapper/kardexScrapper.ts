import { Kardex, MateriaKardex } from './../../core/domain/models';
import { SiaseWebScrapper } from './webScrapper';

export class KardexScrapper extends SiaseWebScrapper {

    getKardex(): Kardex | null {
        const kardex = new Kardex();

        const tables = this.$("table")

        const infoTable = tables.first();
        const kardexTable = this.$(tables[1])

        if (tables.length == 0)
            return null

        const subjects = kardexTable.find("tr")
        const kardexInfo = infoTable.find("tr")

        const careerStudyPlan = this.$(kardexInfo.get(KardexInfoValues.CarreraPlanEstudios)).find("td")

        kardex.setNombreAlumnoFromvalue(this.$(kardexInfo.get(KardexInfoValues.Nombre)).text())
        kardex.setCarreraFromValue(careerStudyPlan.first().text())
        kardex.setPlanEstudiosFromValue(careerStudyPlan.last().text())

        for (let i = 0; i < subjects.length; i++) {
            if (i == 0) continue

            const currentSubject = this.$(subjects[i])
            const newSubject = new MateriaKardex();

            newSubject.setSemestreFromvalue(this.$(currentSubject.children().get(KardexSubjectValues.Semestre)).text())
            newSubject.setClaveMateriaFromValue(this.$(currentSubject.children().get(KardexSubjectValues.Clave)).text())
            newSubject.setNombreFromValue(this.$(currentSubject.children().get(KardexSubjectValues.Nombre)).text())

            const scores = currentSubject.children().slice(KardexSubjectValues.Calificaciones)

            let scoreNum = 0;


            for (let score of scores) {
                scoreNum++;

                const text = this.$(score).text().trim()
                if (!text || text == ""||text == " ") continue;

                if (scoreNum == 7)
                    newSubject.laboratorio = text
                else{
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