import iconv from 'iconv-lite';
import axios from "axios";

export class SiaseNetworkDataSource {
    protected axios = axios.create({
        timeout: 30000,
        responseType: "text"
    });

    constructor() {

        this.axios.interceptors.request.use((request) => {
            request.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Referer":"https://deimos.dgi.uanl.mx/cgi-bin/wspd_cgi.sh/login.htm"
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


}
