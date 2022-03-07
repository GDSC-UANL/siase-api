
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

export class InformacionAlumno {
    matricula: string = "";
    nombre: string = "";
    carrera: string = "";
    planEstudios: string = "";
    foto: string = "";

    constructor(rawData?: string, foto?: string) {
        if (rawData) {
            const data = rawData.split("\n")
            this.matricula = this.getValue(data[InformacionAlumnoValues.Matricula])
            this.nombre = this.getValue(data[InformacionAlumnoValues.Nombre])
            this.carrera = this.getValue(data[InformacionAlumnoValues.Carrera])
            this.planEstudios = this.getValue(data[InformacionAlumnoValues.PlanEstudios])
        }

        if (foto) this.foto = foto


    }

    private getValue(data: string) {
        const newData = data.trim();
        const realValue = newData.split(":").pop()?.trim().replace(/\s/g," ")
        return realValue
            ?.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') ?? "";

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

export class MateriaKardex {
    semestre: number = 1;
    claveMateria: string = "";
    nombre: string = "";
    calificaciones: number[] = []
    laboratorio?:string

    setNombreFromValue(value: string) {
        const name = value.trim()
        this.nombre = name.charAt(0) + name.slice(1).toLowerCase()
    }

    setClaveMateriaFromValue(value: string) {
        this.claveMateria = value.trim()
    }

    setSemestreFromvalue(value: string) {
        this.semestre = Number.parseInt(value)
    }
}

export class Kardex {
    nombreAlumno: string = ""
    carrera: string = ""
    planEstudios: string = ""
    materias: MateriaKardex[] = []

    setNombreAlumnoFromvalue(value: string) {
        const name = value.split(":").pop()!.trim()

        this.nombreAlumno = name.split(" ").map(e => e.charAt(0) + e.slice(1).toLowerCase()).join(" ")

    }

    setCarreraFromValue(value: string) {
        const name = value.split(":").pop()!.trim()

        this.carrera = name.split(" ").map(e => e.charAt(0) + e.slice(1).toLowerCase()).join(" ")

    }

    setPlanEstudiosFromValue(value: string) {
        this.planEstudios = value.split(":").pop()!.trim();
    }
}


enum Days {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
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

enum InformacionAlumnoValues {
    Matricula,
    Nombre,
    Carrera,
    PlanEstudios
}
