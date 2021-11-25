
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

export interface KardexQuery extends qs.ParsedQs {

}

export interface ScheduleQuery extends qs.ParsedQs {
    claveUnidad?: string;
    clavePlanEstudios?: string;
    claveNivelAcademico?: string;
    claveModalidad?: string;
    claveGradoAcademico?: string;
    claveDependencia?: string;
    claveCarrera?: string;
    periodo?: string;
    resill?: string;
    trim: string;
    user: string;
}