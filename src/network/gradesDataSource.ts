import { Carrera } from '@siaseApi/core/domain/careers';
import { PeriodoCalificaciones } from '@siaseApi/core/domain/grades';
import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';
class GradesDataSource extends SiaseNetworkDataSource {


    async getGradesPeriods(query: Carrera, user: string, trim: string): Promise<string> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/econcfs01.htm", {
            params: formData
        })


        return response.data
    }


    async getGradesDetail(query: PeriodoCalificaciones, user: string, trim: string): Promise<string> {
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
        formData.append("HTMLResill", "83747")
        formData.append("HTMLPeriodo", query.periodo!)
        formData.append("HTMLTrund", "econcfs02")

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/control.p", {
            params: formData
        })


        return response.data
    }
}

export const gradesDataSource = new GradesDataSource()