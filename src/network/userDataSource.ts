import { SiaseNetworkDataSource } from '@siaseApi/network/siaseNetworkDataSource';

class UserDataSource extends SiaseNetworkDataSource {

    async loginUser(user: string, password: string): Promise<string> {

        const formData = new URLSearchParams()

        formData.append("HTMLUsuCve", user)
        formData.append("HTMLPassword", password)
        formData.append("HTMLPrograma", "")
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.post("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/eselcarrera.htm", formData)


        return response.data

    }
}

export const userDataSource = new UserDataSource();