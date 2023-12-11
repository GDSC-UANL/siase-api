import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';
import { Carrera } from '@siaseApi/core/domain/careers';
import { Afi, AfiHistorial, AfiRegistrada } from '@siaseApi/core/domain/afis';
import cheerio from 'cheerio';
class AfisDataSource extends SiaseNetworkDataSource {


    async getAfisFromCareer(
        query: Carrera,
        mes: number,
        user: string,
        trim: string
    ): Promise<Afi[]> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", trim!)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLTipCve", "01")

        if (mes != null) {
            const mesString = mes < 10 ? "0" + mes : mes.toString()
            formData.append("HTMLCveMes", mesString)
        }

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/delSavePrereg.htm", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const afis: Afi[] = []
        const tables = $(".TablaLink")

        if (tables.length == 0) throw this.getError($)

        const afisTable = tables.first()

        const rows = afisTable.find("tr")

        let index = 0
        for (let row of rows) {
            if (index++ == 0 || index == rows.length + 1) continue;

            const afi = new Afi();
            const infoCols = $(row).find("td")

            const checkbox = $(infoCols.get(AfiValues.checkbox)).find("input").first()
            afi.registrado = checkbox.is(":checked")
            afi.setOrganizador($(infoCols.get(AfiValues.organizador)).text())
            afi.setArea($(infoCols.get(AfiValues.area)).text())
            afi.setEvento($(infoCols.get(AfiValues.evento)).text())
            afi.setFechaHoraInicio($(infoCols.get(AfiValues.fechaInicio)).text())
            afi.setFechaHoraFin($(infoCols.get(AfiValues.fechaFin)).text())
            afi.setCapacidad($(infoCols.get(AfiValues.capacidad)).text())
            afi.setAlumnosRegistrados($(infoCols.get(AfiValues.registro)).text())
            afi.setDisponibles($(infoCols.get(AfiValues.disponibles)).text())
            afi.setDescription($(infoCols.get(AfiValues.evento)).attr("title"))
            afis.push(afi)
        }

        return afis
    }


    async getAfisHistoryFromCareer(
        query: Carrera,
        user: string,
        trim: string
    ): Promise<AfiHistorial> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", trim!)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/delConsRegEven.htm", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const historial = new AfiHistorial()

        const tables = $("table")

        if (tables.length == 0) throw this.getError($)

        const infoTable = $(tables[2])
        const afisTable = $(tables[3])

        const totalAfisValues = $(infoTable.find("tr")).find("td")

        if (totalAfisValues.length == 0) throw this.getError($)

        historial.completadas = Number.parseInt($(totalAfisValues.get(0)).text())
        historial.total = Number.parseInt($(totalAfisValues.get(1)).text())
    
        const rows = afisTable.find("tr")
        let index = 0
        for (let row of rows) {
            if (index++ == 0 || index == rows.length + 1) continue;

            const afi = new AfiRegistrada();
            const infoCols = $(row).find("td")

            const info = $(infoCols.get(AfiHistorialValues.evento))


            const infoValues = info.find("b")


            afi.setEvento($(infoValues.get(AfiHistorialInfoValues.evento).next).text())
            afi.setIdEvento($(infoValues.get(AfiHistorialInfoValues.evento)).text())
            afi.setIndicaciones($(infoValues.get(AfiHistorialInfoValues.indicaciones).next).text())
            afi.setRecinto($(infoValues.get(AfiHistorialInfoValues.recinto).next).text())
            afi.setSede($(infoValues.get(AfiHistorialInfoValues.sede).next).text())
            afi.setDireccion($(infoValues.get(AfiHistorialInfoValues.direccion).next).text())
            afi.setMunicipio($(infoValues.get(AfiHistorialInfoValues.municipio).next).text())
            afi.setEstado($(infoValues.get(AfiHistorialInfoValues.estado).next).text())
            afi.setPais($(infoValues.get(AfiHistorialInfoValues.pais).next).text())
            afi.setOrganizador($(infoValues.get(AfiHistorialInfoValues.organizador).next).text())

            afi.setArea($(infoCols.get(AfiHistorialValues.area)).text())
            afi.setAsistencia($(infoCols.get(AfiHistorialValues.asistencia)).text())
            afi.setFechaHoraInicio($(infoCols.get(AfiHistorialValues.fecha)).text())
            afi.setEventoOficial($(infoCols.get(AfiHistorialValues.eventoOficial)).text())
            afi.setNumEventoOficial($(infoCols.get(AfiHistorialValues.numEventoificial)).text())
            afi.setPeriodoEscolar($(infoCols.get(AfiHistorialValues.periodoEscolar)).text())


            historial.afis.push(afi)
        }

        return historial
    }
}

export const afisDataSource = new AfisDataSource()

enum AfiValues {
    checkbox,
    organizador,
    area,
    evento,
    fechaInicio,
    fechaFin,
    capacidad,
    registro,
    disponibles
}

enum AfiHistorialValues {
    evento,
    area,
    fecha,
    asistencia,
    eventoOficial,
    numEventoificial,
    periodoEscolar
}

enum AfiHistorialInfoValues {
    evento,
    indicaciones,
    recinto,
    sede,
    direccion,
    municipio,
    estado,
    pais,
    organizador
}