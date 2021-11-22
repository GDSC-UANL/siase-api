import { SiaseNetworkDataSource } from './siaseNetworkDataSource';
import https from 'https'
class UserDataSource extends SiaseNetworkDataSource {

    async loginUser(user: string, password: string): Promise<string> {

        const formData = new URLSearchParams()

        formData.append("HTMLUsuCve", user)
        formData.append("HTMLPassword", password)
        formData.append("HTMLPrograma", "")
        formData.append("HTMLTipCve", "01")

        const response = await this.axios.post("https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/eselcarrera.htm", formData, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return response.data;

    }
}

export const userDataSource = new UserDataSource();