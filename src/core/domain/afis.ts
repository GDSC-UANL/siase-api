import "@siaseApi/core/utils/stringExtensions.ext"
export class Afi {
    organizador?: string
    area?: string;
    evento?: string;
    descripcion?: string;
    fechaInicio?: string;
    horaInicio?: string;
    fechaFin?: string;
    horaFin?: string;
    capacidad?: number
    alumnosRegistrados?: number
    disponibles?: number;

    setOrganizador(value?: string) {
        if (!value) return
        this.organizador = value.trim().capitalizeFirst();
    }


    setArea(value?: string) {
        if (!value) return
        this.area = value.trim().capitalizeFirst();
    }


    setEvento(value?: string) {
        if (!value) return
        this.evento = value.trim().capitalizeFirst();
    }

    setFechaHoraInicio(value?: string) {
        if (!value) return
        const valueSplit = value.trim().split(" ")
        this.fechaInicio = valueSplit.shift();
        this.horaInicio = valueSplit.pop();
    }


    setFechaHoraFin(value?: string) {
        if (!value) return
        const valueSplit = value.trim().split(" ")
        this.fechaFin = valueSplit.shift();
        this.horaFin = valueSplit.pop();
    }

    setCapacidad(value?: string) {
        if (!value) return

        const numericVal = Number.parseInt(value)

        if (Number.isNaN(numericVal)) return

        this.capacidad = numericVal
    }


    setAlumnosRegistrados(value?: string) {
        if (!value) return

        const numericVal = Number.parseInt(value)

        if (Number.isNaN(numericVal)) return

        this.alumnosRegistrados = numericVal
    }


    setDisponibles(value?: string) {
        if (!value) return

        const numericVal = Number.parseInt(value)

        if (Number.isNaN(numericVal)) return

        this.disponibles = numericVal
    }

}