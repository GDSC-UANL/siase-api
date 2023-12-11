import { Carrera, Horario, HorarioDetalle, Materia } from '@siaseApi/core/domain/careers';
import { SiaseNetworkDataSource } from "@siaseApi/network/siaseNetworkDataSource";
import cheerio from 'cheerio'
class CareerDataSource extends SiaseNetworkDataSource {

    async getCareerSchedules(career: Carrera, user: string, trim: string): Promise<Horario[]> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", career.claveCarrera!)
        formData.append("HTMLCve_Dependencia", career.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", career.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", career.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", career.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", career.clavePlanEstudios!)
        formData.append("HTMLtrim", trim!)
        formData.append("HTMLCve_Unidad", career.claveUnidad!)
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/echalm01.htm", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const schedules = $("option")
        const resill = $("[name=HTMLResill]").attr("value")

        if (!resill)
            throw this.getError($)

        const parsedSchedules: Horario[] = []

        for (let schedule of schedules) {

            const parsedSchedule = $(schedule);
            const value = parsedSchedule.attr("value")

            if (!value || value == "0")
                continue;

            parsedSchedules.push(new Horario(career, parsedSchedule.text(), value))

        }

        return parsedSchedules;
    }


    async getScheduleDetail(query: Horario, user: string, trim: string): Promise<HorarioDetalle> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", trim)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLResill", "1")
        formData.append("HTMLPeriodo", query.periodo!)
        formData.append("HTMLTrund", "echalm02")
        formData.append("HTMLTipCve", "01")


        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/control.p", {
            params: formData
        })

        const $ = cheerio.load(response.data)

        const tables = $("table")

        if (tables.length == 0)
            this.getError($)

        const scheduleTable = tables.first();
        const infoTable = $(tables[1]);
        const infoElements = infoTable.find("tr");
        const elements = scheduleTable.find(".text-center")

        const scheduleDetail = new HorarioDetalle();

        const subjects = new Map<string, Materia>();

        for (let i = 0; i < infoElements.length; i++) {

            if (i == 0) continue;

            const info = $(infoElements[i]);

            const subject = new Materia();

            subject.tipo = $(info.children().get(SubjectValues.Tipo)).text()
            subject.grupo = $(info.children().get(SubjectValues.Grupo)).text()
            subject.nombre = $(info.children().get(SubjectValues.Nombre)).text()
            subject.claveMateria = $(info.children().get(SubjectValues.ClaveMateria)).text()
            subject.nombreCorto = $(info.children().get(SubjectValues.Abreviacion)).text()
            subject.modalidad = $(info.children().get(SubjectValues.TipoOferta)).text()
            subject.oportunidad = $(info.children().get(SubjectValues.Oportunidad)).text()

            subjects.set(subject.nombreCorto, subject)
        }

        let startTime = ""
        let endTime = ""

        let substract = 0

        for (let i = 0; i < elements.length; i++) {
            const subject = $(elements[i])

            if (i % 7 == 0) {
                let times = subject.html()!.split(/ *a<br> */g)
                startTime = times.shift()?.trim()!
                endTime = times.pop()!.trim()!
                substract++

                continue;
            }

            const values = subject.html()!
                .replace(/<br>/g, " / ")
                .replace(/<b>/g, "")
                .replace(/<\/b>/g, "")
                .replace(/ \/ /g, "/");

            if (values == "&nbsp;") continue;

            const split = values.split("/")

            const fase = split[SubjectItemValues.Fase]
            const shortName = split[SubjectItemValues.NombreCorto]
            const classroom = split[SubjectItemValues.Salon]

            const currentSubject = { ...subjects.get(shortName)! }

            currentSubject.fase = fase;
            currentSubject.salon = classroom;
            currentSubject.horaInicio = startTime;
            currentSubject.horaFin = endTime;

            scheduleDetail.addSubject(currentSubject, (i - substract) % 6)

        }
        return scheduleDetail;

    }

}

export const careerDataSource = new CareerDataSource()

enum SubjectItemValues {
    Fase,
    Tipo,
    NombreCorto,
    Grupo,
    Salon
}

enum SubjectValues {
    Tipo,
    ClaveMateria,
    Nombre,
    Abreviacion,
    Grupo,
    TipoOferta,
    FrecuenciaPresencial,
    FrecuenciaEnLinea,
    FrecuenciaTotla,
    Creditos,
    Oportunidad,
}