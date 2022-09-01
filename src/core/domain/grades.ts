import { Carrera } from '@siaseApi/core/domain/careers';
export class PeriodoCalificaciones {
    nombre?: string
    claveDependencia: string = ""
    claveUnidad: string = ""
    claveNivelAcademico: string = ""
    claveGradoAcademico: string = ""
    claveModalidad: string = ""
    clavePlanEstudios: string = ""
    claveCarrera: string = ""
    periodo?: string

    constructor(career?: Carrera, name?: string, period?: string) {
        if (name) {
            this.nombre = name.trim().capitalizeFirst();
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

export class Calificacion {
    claveMateria?: string
    nombre?: string
    tipoInscripcion?: string
    grupo?: string
    fecha?: string;
    calificacion?: string;
    oportunidad?: string
}