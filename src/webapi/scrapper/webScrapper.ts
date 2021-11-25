import axios from "axios";
import cheerio from 'cheerio'

export class SiaseWebScrapper {


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
    

}
