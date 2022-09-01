export class MateriaKardex {
    semestreMateria: string = ""
    claveMateria: string = "";
    nombre: string = "";
    oportunidades: string[] = []
    laboratorio?: string


    setNombreFromValue(value: string) {
        const name = value.trim()
        this.nombre = name.capitalizeFirst();
    }

    setClaveMateriaFromValue(value: string) {
        this.claveMateria = value.trim()
    }

    setSemestreFromvalue(value: string) {
        this.semestreMateria = value.trim()
    }

}

export class Kardex {
    nombreAlumno: string = ""
    carrera: string = ""
    planEstudios: string = ""
    materias: MateriaKardex[] = []

    setNombreAlumnoFromvalue(value: string) {
        const name = value.split(":").pop()!.trim()

        this.nombreAlumno = name.split(" ").map(e => e.capitalizeFirst()).join(" ")

    }

    setCarreraFromValue(value: string) {
        const name = value.split(":").pop()!.trim()

        this.carrera = name.split(" ").map(e => e.capitalizeFirst()).join(" ")

    }

    setPlanEstudiosFromValue(value: string) {
        this.planEstudios = value.split(":").pop()!.trim();
    }
}