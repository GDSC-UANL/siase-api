import iconv from 'iconv-lite';
import axios from "axios";
import { ErrorResponse } from './exceptions/errorResponse';

export class SiaseNetworkDataSource {
    protected axios = axios.create({
        timeout: 30000,
        responseType: "text"
    });

    constructor() {

        this.axios.interceptors.request.use((request) => {
            request.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer":"https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/login.htm",
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"

            }
            request.responseType = 'arraybuffer'
            return request
        }, (error) => {
            return Promise.reject(error)
        })


        this.axios.interceptors.response.use((value) => {
            value.data = iconv.decode(value.data, "ISO-8859-1")
            return value
        }, (error) => {
            return Promise.reject(error);
        })
    }

    getError($:cheerio.Root): ErrorResponse {
        const regex = new RegExp(/\'(.*?)\'/g)
        const alert = $("SCRIPT").last().html() ?? ""
        const alertText = regex.exec(alert)?.pop() ?? "Ocurrió un error al obtener la información"
        return ErrorResponse.getErrorByMessage(alertText);
    }

}
