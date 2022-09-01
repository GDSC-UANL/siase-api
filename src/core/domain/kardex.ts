export class MateriaKardex {
    semestreMateria: string = ""
    claveMateria: string = "";
    nombre: string = "";
    oportunidades: string[] = []
    laboratorio?: string


    setNombreFromValue(value: string) {
        const name = value.trim()
        this.nombre = name.charAt(0) + name.slice(1).toLowerCase()
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