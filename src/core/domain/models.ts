import { urlencoded } from "express"

export class Carrera {
    nombre: string = ""
    claveDependencia: string = ""
    claveUnidad: string = ""
    claveNivelAcademico: string = ""
    claveGradoAcademico: string = ""
    claveModalidad: string = ""
    clavePlanEstudios: string = ""
    claveCarrera: string = ""

    constructor(urlData: string, name: string) {
        const data = urlData.split(";")
        this.nombre = name.charAt(0) + name.slice(1).toLowerCase()
        this.claveDependencia = this.getValue(data[CarreraValues.ClaveDependencia])
        this.claveUnidad = this.getValue(data[CarreraValues.ClaveUnidad])
        this.claveNivelAcademico = this.getValue(data[CarreraValues.ClaveNivelAcademico])
        this.claveGradoAcademico = this.getValue(data[CarreraValues.ClaveGradoAcademico])
        this.claveModalidad = this.getValue(data[CarreraValues.ClaveModalidad])
        this.clavePlanEstudios = this.getValue(data[CarreraValues.ClavePlanEstudios])
        this.claveCarrera = this.getValue(data[CarreraValues.ClaveCarrera])


    }

    private getValue(data: string) {

        return data.split("=").pop()?.replace("'", "") || ""

    }


}

enum CarreraValues {
    ClaveDependencia,
    ClaveUnidad,
    ClaveNivelAcademico,
    ClaveGradoAcademico,
    ClaveModalidad,
    ClavePlanEstudios,
    ClaveCarrera,
}