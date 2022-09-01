export interface TokenPayload {
    user: string
    trim: string
    careers: object[]
    picture: string
    name: string
}

export class ErrorResponse {


    static sessionExpired = "Procedimiento restringido, iniciar sesion nuevamente."

    static errors = {
        [this.sessionExpired]: new ErrorResponse(this.sessionExpired, 501)
    }

    constructor(
        public message = "Ocurrió un error al obtener la información",
        public statusCode = 500
    ) {

    }

    static getErrorByMessage(message: string) {

        const error = this.errors[message]

        return error ?? new ErrorResponse(message)

    }
}
