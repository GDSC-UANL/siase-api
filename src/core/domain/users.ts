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
        const realValue = newData.split(":").pop()?.trim().replace(/\s/g, " ")
        return realValue
            ?.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') ?? "";

    }
}



enum InformacionAlumnoValues {
    Matricula,
    Nombre,
    Carrera,
    PlanEstudios
}
