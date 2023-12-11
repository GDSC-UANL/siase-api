export class ErrorResponse extends Error {


    static sessionExpired = "Procedimiento restringido, iniciar sesion nuevamente."
    static inactivityTime = "El tiempo de inactividad (30 minutos) excedio, iniciar sesion nuevamente."

    static errors = {
        [this.sessionExpired]: new ErrorResponse(this.sessionExpired, 401),
        [this.inactivityTime]: new ErrorResponse(this.inactivityTime, 401)
    }

    constructor(
        public message = "Ocurrió un error al obtener la información",
        public statusCode = 500
    ) {
        super(message)
    }

    static getErrorByMessage(message: string) {

        const error = this.errors[message]

        return error ?? new ErrorResponse(message)

    }
}