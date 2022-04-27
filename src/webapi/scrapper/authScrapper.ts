import { SiaseWebScrapper } from "./webScrapper";

export class AuthScrapper extends SiaseWebScrapper {

    getTrimFromLoginResponse(): string | null {

        return this.$("[name=HTMLtrim]").attr("value") ?? null

    }

}