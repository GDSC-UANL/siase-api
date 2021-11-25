import axios from "axios";

export class SiaseNetworkDataSource {
    protected axios = axios.create({
        timeout: 30000
    });

}