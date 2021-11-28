import { HorarioDetalle, Materia, Carrera, Horario } from './../../core/domain/models';
import { SiaseWebScrapper } from './webScrapper';
export class CareerScrapper extends SiaseWebScrapper {

    getCareersFromLoginResponse(): Carrera[] | null {

        const form = this.$("form[name=SelCarrera]")

        if (form.length == 0)
            return null

        const carreras = form.first().find("a")

        const parsedCarreras: Carrera[] = []

        for (let carrera of carreras) {

            const parsedCarrera = this.$(carrera);

            const name = parsedCarrera.text();
            const urlData = parsedCarrera.attr("href")

            if (!urlData) continue;

            parsedCarreras.push(new Carrera(urlData, name))

        }

        return parsedCarreras;

    }

    getCareerSchedules(career: Carrera): Horario[] | null {

        const schedules = this.$("option")
        const resill = this.$("[name=HTMLResill]").attr("value")

        if (!resill)
            return null

        const parsedSchedules: Horario[] = []

        for (let schedule of schedules) {

            const parsedSchedule = this.$(schedule);
            const value = parsedSchedule.attr("value")

            if (!value || value == "0")
                continue;

            parsedSchedules.push(new Horario(career, parsedSchedule.text(), value))

        }

        return parsedSchedules;

    }

    getScheduleDetail() {
        const tables = this.$("table")

        if (tables.length == 0)
            return null

        const scheduleTable = tables.first();
        const infoTable = this.$(tables[1]);
        const infoElements = infoTable.find("tr");
        const elements = scheduleTable.find(".text-center")

        const scheduleDetail = new HorarioDetalle();

        const subjects = new Map<string, Materia>();

        for (let i = 0; i < infoElements.length; i++) {

            if (i == 0) continue;

            const info = this.$(infoElements[i]);

            const subject = new Materia();

            subject.tipo = this.$(info.children().get(SubjectValues.Tipo)).text()
            subject.grupo = this.$(info.children().get(SubjectValues.Grupo)).text()
            subject.nombre = this.$(info.children().get(SubjectValues.Nombre)).text()
            subject.claveMateria = this.$(info.children().get(SubjectValues.ClaveMateria)).text()
            subject.nombreCorto = this.$(info.children().get(SubjectValues.Abreviacion)).text()
            subject.modalidad = this.$(info.children().get(SubjectValues.TipoOferta)).text()
            subject.oportunidad = this.$(info.children().get(SubjectValues.Oportunidad)).text()

            subjects.set(subject.nombreCorto, subject)
        }

        let startTime = ""
        let endTime = ""

        let substract = 0

        for (let i = 0; i < elements.length; i++) {
            const subject = this.$(elements[i])

            if (i % 7 == 0) {
                let times = subject.html()!.split(/ *a<br> */g)
                startTime = times.shift()?.replace(" ", "")!
                endTime = times.pop()!
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

            const currentSubject = subjects.get(shortName)!

            currentSubject.fase = fase;
            currentSubject.salon = classroom;
            currentSubject.horaInicio = startTime;
            currentSubject.horaFin = endTime;

            scheduleDetail.addSubject(currentSubject, (i - substract) % 6)

        }

        return scheduleDetail;
    }

}

enum SubjectItemValues {
    Fase,
    Tipo,
    NombreCorto,
    Grupo,
    Salon
}

enum SubjectValues {
    Tipo,
    Grupo,
    ClaveMateria,
    Abreviacion,
    TipoOferta,
    Nombre,
    Oportunidad,
}