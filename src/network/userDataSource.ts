import { Carrera } from '@siaseApi/core/domain/careers';
import { AuthResponse, InformacionAlumno } from '@siaseApi/core/domain/users';
import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';
import cheerio from 'cheerio'

class UserDataSource extends SiaseNetworkDataSource {

    async loginUser(user: string, password: string): Promise<AuthResponse> {

        const formData = new URLSearchParams()

        formData.append("HTMLUsuCve", user)
        formData.append("HTMLPassword", password)
        formData.append("HTMLPrograma", "")
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.post("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/eselcarrera.htm", formData)

        const $ = cheerio.load(response.data)

        const trim = $("[name=HTMLtrim]").attr("value") ?? null

        if (trim == null)
            throw this.getError($)

        const form = $("form[name=SelCarrera]")

        if (form.length == 0)
            throw this.getError($)

        const carreras = form.first().children()

        const parsedCarreras: Carrera[] = []

        let sectionNumber = 0;

        for (let carrera of carreras) {

            const parsedCarrera = $(carrera);

            if (parsedCarrera.is("p")) sectionNumber++
            if (sectionNumber > 1) break;

            if (!parsedCarrera.is("a")) continue;

            const name = parsedCarrera.text();
            const urlData = parsedCarrera.attr("href")

            if (!urlData) continue;


            parsedCarreras.push(new Carrera(urlData, name))

        }

        const authResponse = new AuthResponse()
        authResponse.carreras = parsedCarreras;
        authResponse.trim = trim;

        return authResponse;

    }

    async getUserInfo(query: Carrera, user: string, trim: string): Promise<InformacionAlumno> {
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

        const $ = cheerio.load(response.data)
        const images = $("img")

        const profilePicture = $(images[1]).attr("src")

        const userData = $(".style1")
        if (userData.text() == "") throw this.getError($)

        const userInfo = new InformacionAlumno(userData.text(), profilePicture)

        return userInfo;
    }
}

export const userDataSource = new UserDataSource();