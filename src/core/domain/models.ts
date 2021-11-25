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

        return data.split("=").pop()?.replace(/'/g, "") || ""

    }


}

export class Schedule {
    nombre: string = ""
    claveDependencia: string = ""
    claveUnidad: string = ""
    claveNivelAcademico: string = ""
    claveGradoAcademico: string = ""
    claveModalidad: string = ""
    clavePlanEstudios: string = ""
    claveCarrera: string = ""
    period: string = ""
    resill: string = ""

    constructor(career: CareerQuery, name: string, period: string, resill: string) {
        const newName = name.replace("&nbsp;", " ")
        this.nombre = newName.charAt(0) + newName.slice(1).toLowerCase();
        this.claveCarrera = career.claveCarrera!;
        this.claveDependencia = career.claveDependencia!;
        this.claveGradoAcademico = career.claveGradoAcademico!;
        this.claveModalidad = career.claveModalidad!;
        this.claveNivelAcademico = career.claveNivelAcademico!;
        this.claveModalidad = career.claveModalidad!;
        this.clavePlanEstudios = career.clavePlanEstudios!;
        this.claveUnidad = career.claveUnidad!;
        this.period = period;
        this.resill = resill;
    }
}

export interface CareerQuery extends qs.ParsedQs {
    claveUnidad?: string;
    clavePlanEstudios?: string;
    claveNivelAcademico?: string;
    claveModalidad?: string;
    claveGradoAcademico?: string;
    claveDependencia?: string;
    claveCarrera?: string;
    trim: string;
    user: string;
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