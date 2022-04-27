import { Carrera, Horario } from '../core/domain/models';
import { SiaseNetworkDataSource } from "./siaseNetworkDataSource";
import https from 'https'
import iconv from 'iconv-lite'
class CareerDataSource extends SiaseNetworkDataSource {

    async getCareerSchedules(query: Carrera, user: string, trim: string): Promise<string> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/echalm01.htm", {
            params: formData
        })


        return response.data
    }

    async getUserInfoResponse(query: Carrera, user: string, trim: string): Promise<string> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/maintop.htm", {
            params: formData
        })

        return response.data;
    }

    async getScheduleDetail(query: Horario, user: string, trim: string): Promise<string> {
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

        return response.data;
    }

}

export const careerDataSource = new CareerDataSource()