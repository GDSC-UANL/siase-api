import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';
import { Carrera } from '@siaseApi/core/domain/careers';
class AfisDataSource extends SiaseNetworkDataSource {


    async getAfisFromCareer(query: Carrera, user: string, trim: string): Promise<string> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/delSavePrereg.htm", {
            params: formData
        })


        return response.data
    }

}

export const afisDataSource = new AfisDataSource()
