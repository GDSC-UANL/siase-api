import { Kardex, MateriaKardex } from './../../core/domain/models';
import { SiaseWebScrapper } from './webScrapper';

export class KardexScrapper extends SiaseWebScrapper {

    getKardex(): Kardex {
        const kardex = new Kardex();

        const tables = this.$("table")

        const infoTable = tables.first();
        const kardexTable = this.$(tables[1])

        const subjects = kardexTable.find("tr")
        const kardexInfo = infoTable.find("tr")

        kardex.setNombreAlumnoFromvalue(this.$(kardexInfo.children().get(KardexInfoValues.Nombre)).text())
        kardex.setCarreraFromValue(this.$(kardexInfo.children().get(KardexInfoValues.Carrera)).text())
        kardex.setPlanEstudiosFromValue(this.$(kardexInfo.children().get(KardexInfoValues.PlanEstudios)).text())

        for (let i = 0; i < subjects.length; i++) {
            if (i == 0) continue

            const currentSubject = this.$(subjects[i])
            const newSubject = new MateriaKardex();

            newSubject.setSemestreFromvalue(this.$(currentSubject.children().get(KardexSubjectValues.Semestre)).text())
            newSubject.setClaveMateriaFromValue(this.$(currentSubject.children().get(KardexSubjectValues.Clave)).text())
            newSubject.setNombreFromValue(this.$(currentSubject.children().get(KardexSubjectValues.Nombre)).text())

            const scores = currentSubject.children().slice(KardexSubjectValues.Calificaciones)

            for (let score of scores) {

                const value = Number.parseInt(this.$(score).text())

                if (!value) continue;

                newSubject.calificaciones.push(value)

            }

            kardex.materias.push(newSubject)

        }


        return kardex;
    }

}

enum KardexInfoValues {
    Nombre,
    Carrera,
    PlanEstudios

}

enum KardexSubjectValues {
    Semestre,
    Mod,
    Clave,
    Nombre,
    Calificaciones
}