import { Carrera } from "../core/domain/careers";
import { SiaseNetworkDataSource } from "./siaseNetworkDataSource";

class KardexDataSource extends SiaseNetworkDataSource {

    async getKardexResponse(query: Carrera, user: string, trim: string): Promise<string> {
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

        const response = await this.axios.get("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/econkdx01.htm", {
            params: formData
        })

        return response.data;
    }

}

export const kardexDataSource = new KardexDataSource();