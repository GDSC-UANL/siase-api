export class Carrera {
    nombre: string = ""
    claveDependencia: string = ""
    claveUnidad: string = ""
    claveNivelAcademico: string = ""
    claveGradoAcademico: string = ""
    claveModalidad: string = ""
    clavePlanEstudios: string = ""
    claveCarrera: string = ""

    constructor(urlData?: string, name?: string) {

        if (urlData) {
            const data = urlData.split(";")
            this.claveDependencia = this.getValue(data[CarreraValues.ClaveDependencia])
            this.claveUnidad = this.getValue(data[CarreraValues.ClaveUnidad])
            this.claveNivelAcademico = this.getValue(data[CarreraValues.ClaveNivelAcademico])
            this.claveGradoAcademico = this.getValue(data[CarreraValues.ClaveGradoAcademico])
            this.claveModalidad = this.getValue(data[CarreraValues.ClaveModalidad])
            this.clavePlanEstudios = this.getValue(data[CarreraValues.ClavePlanEstudios])
            this.claveCarrera = this.getValue(data[CarreraValues.ClaveCarrera])
        }

        if (name)
            this.nombre = name.charAt(0) + name.slice(1).toLowerCase()
    }

    private getValue(data: string) {

        return data?.split("=")?.pop()?.replace(/'/g, "") || ""

    }


}

export class Horario {
    nombre: string = ""
    claveDependencia: string = ""
    claveUnidad: string = ""
    claveNivelAcademico: string = ""
    claveGradoAcademico: string = ""
    claveModalidad: string = ""
    clavePlanEstudios: string = ""
    claveCarrera: string = ""
    periodo: string = ""

    constructor(career?: Carrera, name?: string, period?: string) {
        if (name) {
            const newName = name.trim()
            this.nombre = newName.charAt(0) + newName.slice(1).toLowerCase();
        }

        if (career) {
            this.claveCarrera = career.claveCarrera!;
            this.claveDependencia = career.claveDependencia!;
            this.claveGradoAcademico = career.claveGradoAcademico!;
            this.claveModalidad = career.claveModalidad!;
            this.claveNivelAcademico = career.claveNivelAcademico!;
            this.claveModalidad = career.claveModalidad!;
            this.clavePlanEstudios = career.clavePlanEstudios!;
            this.claveUnidad = career.claveUnidad!;
        }

        if (period)
            this.periodo = period;

    }
}

export class Materia {
    nombre: string = ""
    nombreCorto = ""
    fase: string = ""
    tipo: string = ""
    grupo: string = ""
    salon: string = ""
    horaInicio: string = ""
    horaFin: string = ""
    claveMateria: string = ""
    modalidad: string = ""
    oportunidad: string = ""



}
export class HorarioDetalle {
    lunes: Materia[] = []
    martes: Materia[] = []
    miercoles: Materia[] = []
    jueves: Materia[] = []
    viernes: Materia[] = []
    sabado: Materia[] = []

    addSubject(subject: Materia, day: number) {
        switch (day) {
            case Days.Monday:
                this.lunes.push(subject)
                break;
            case Days.Tuesday:
                this.martes.push(subject)
                break;
            case Days.Wednesday:
                this.miercoles.push(subject)
                break;
            case Days.Thursday:
                this.jueves.push(subject)
                break;
            case Days.Friday:
                this.viernes.push(subject)
                break;
            case Days.Saturday:
                this.sabado.push(subject)
                break;
        }
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

enum Days {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}
