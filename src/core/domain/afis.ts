import "@siaseApi/core/utils/stringExtensions.ext"

export class AfiHistorial {
    completadas = 0
    total = 0
    afis: AfiRegistrada[] = []
}

export class Afi {
    registrado?: boolean = false
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

    asistencia = false;
    eventoOficial = false;
    numEventoOficial?: number
    periodoEscolar?: string

    setDescription(value?: string) {
        if (!value) return
        this.descripcion = value.trim()
    }

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

    setNumEventoOficial(value?: string) {
        if (!value) return

        const numericVal = Number.parseInt(value)

        if (Number.isNaN(numericVal)) return

        this.numEventoOficial = numericVal
    }

    setAsistencia(value?: string) {
        if (!value) return
        this.asistencia = value == "Si"
    }

    setEventoOficial(value?: string) {
        if (!value) return
        this.eventoOficial = value == "Si"
    }

    setPeriodoEscolar(value?: string) {
        if (!value) return
        this.periodoEscolar = value.trim().capitalizeFirst();
    }

}

export class AfiRegistrada {
    area?: string;

    evento?: string;
    idEvento?: string;
    indicaciones?: string;
    recinto?: string
    sede?: string
    direccion?: string
    municipio?: string
    estado?: string
    pais?: string
    organizador?: string

    fechaInicio?: string;
    horaInicio?: string;

    asistencia = false;
    eventoOficial = false;
    numEventoOficial?: number
    periodoEscolar?: string


    setEvento(value?: string) {
        if (!value) return
        this.evento = value.trim().capitalizeFirst();
    }

    setIdEvento(value?: string) {
        if (!value) return
        this.idEvento = value.split(" ")?.shift()?.trim().capitalizeFirst();
    }

    setIndicaciones(value?: string) {
        if (!value) return
        this.indicaciones = value.trim().capitalizeFirst();
    }

    setRecinto(value?: string) {
        if (!value) return
        this.recinto = value.trim().capitalizeFirst();
    }

    setSede(value?: string) {
        if (!value) return
        this.sede = value.trim().capitalizeFirst();
    }

    setDireccion(value?: string) {
        if (!value) return
        this.direccion = value.trim().capitalizeFirst();
    }

    setMunicipio(value?: string) {
        if (!value) return
        this.municipio = value.trim().capitalizeFirst();
    }

    setEstado(value?: string) {
        if (!value) return
        this.estado = value.trim().capitalizeFirst();
    }

    setPais(value?: string) {
        if (!value) return
        this.pais = value.trim().capitalizeFirst();
    }

    setOrganizador(value?: string) {
        if (!value) return
        this.organizador = value.trim().capitalizeFirst();
    }

    setArea(value?: string) {
        if (!value) return
        this.area = value.trim().capitalizeFirst();
    }

    setFechaHoraInicio(value?: string) {
        if (!value) return
        const valueSplit = value.trim().split(" ")
        this.fechaInicio = valueSplit.shift();
        this.horaInicio = valueSplit.pop();
    }

    setNumEventoOficial(value?: string) {
        if (!value) return

        const numericVal = Number.parseInt(value)

        if (Number.isNaN(numericVal)) return

        this.numEventoOficial = numericVal
    }

    setAsistencia(value?: string) {
        if (!value) return
        this.asistencia = value == "Si"
    }

    setEventoOficial(value?: string) {
        if (!value) return
        this.eventoOficial = value == "Si"
    }

    setPeriodoEscolar(value?: string) {
        if (!value) return
        this.periodoEscolar = value.trim().capitalizeFirst();
    }
}