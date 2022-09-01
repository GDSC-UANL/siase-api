class Campus {
    id?: number;
    nombre?: string;
    latitud?: number;
    longitud?: number;
    edificios: Edificio[] = []
}

class Edificio {
    id?: number;
    nombre?: string;
    latitud?: number;
    longitud?: number;
    idCampus?: number
    tipo?: TiposEdificios
}

class Facultad extends Edificio {

    claveDependencia?: string
    salones: Salon[] = []
    edificios: Edificio[] = []

    constructor() {
        super();
        this.tipo = TiposEdificios.facultad
    }
}

class EdificioSalones extends Edificio {
    salones: Salon[] = []

    constructor() {
        super();
        this.tipo = TiposEdificios.salones
    }
}


class Salon {
    claveDependencia?: string
    idEdificio?: string
    nombre?: string
    latitud?: number;
    longitud?: number;
}

class Cafeteria extends Edificio {
    claveDependencia?: string
    menu: ItemMenu[] = []

    constructor() {
        super();
        this.tipo = TiposEdificios.cafeteria
    }
}

class ItemMenu {
    nombre?: string;
    precio?: number;
}

class Gimnasio extends Edificio {
    claveDependencia?: string
    constructor() {
        super();
        this.tipo = TiposEdificios.gimnasio
    }
}

class Estadio extends Edificio {
    constructor() {
        super();
        this.tipo = TiposEdificios.estadio
    }
}


class Biblioteca extends Edificio {
    constructor() {
        super();
        this.tipo = TiposEdificios.biblioteca
    }
}


enum TiposEdificios {
    facultad,
    cafeteria,
    gimnasio,
    biblioteca,
    estadio,
    salones
}



