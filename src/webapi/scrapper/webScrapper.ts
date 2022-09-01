import cheerio from 'cheerio'
import { ErrorResponse } from '@siaseApi/webapi/models/models';


export class SiaseWebScrapper {


    errors = {

    }

    private _$?: cheerio.Root

    protected get $() {

        if (!this._$)
            throw new Error("HTML not loaded, please load an HTML with loadResponse()")

        return this._$;

    }

    constructor(html?: string) {
        if (html)
            this.loadResponse(html)
    }

    loadResponse(html: string) {
        this._$ = cheerio.load(html)
    }

    getError(): ErrorResponse {
        const regex = new RegExp(/\'(.*?)\'/g)
        const alert = this.$("SCRIPT").last().html() ?? ""
        const alertText = regex.exec(alert)?.pop() ?? "Ocurrió un error al obtener la información"
        return ErrorResponse.getErrorByMessage(alertText);
    }

}
