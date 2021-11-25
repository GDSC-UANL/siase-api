import { ScheduleQuery } from './../core/domain/queries';
import { CareerQuery } from "../core/domain/queries";
import { SiaseNetworkDataSource } from "./siaseNetworkDataSource";
import https from 'https'
class CareerDataSource extends SiaseNetworkDataSource {

    async getCareerSchedules(query: CareerQuery): Promise<string> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", query.user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", query.trim!)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/echalm01.htm", {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            params: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return response.data;
    }

    async getScheduleDetail(query: ScheduleQuery): Promise<string> {
        const formData = new URLSearchParams()

        formData.append("HTMLUsuario", query.user)
        formData.append("HTMLCve_Carrera", query.claveCarrera!)
        formData.append("HTMLCve_Dependencia", query.claveDependencia!)
        formData.append("HTMLCve_Grado_Academico", query.claveGradoAcademico!)
        formData.append("HTMLCve_Modalidad", query.claveModalidad!)
        formData.append("HTMLCve_Nivel_Academico", query.claveNivelAcademico!)
        formData.append("HTMLCve_Plan_Estudio", query.clavePlanEstudios!)
        formData.append("HTMLtrim", query.trim!)
        formData.append("HTMLCve_Unidad", query.claveUnidad!)
        formData.append("HTMLResill", query.resill!)
        formData.append("HTMLPeriodo", query.periodo!)
        formData.append("HTMLTrund", "echalm02")
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/control.p", {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            params: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return response.data;
    }

}

export const careerDataSource = new CareerDataSource()