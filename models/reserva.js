const { v4: uuidv4 } = require('uuid');

class Reserva {
    id = '';
    cliente = '';
    checkIn = '';
    checkOut = '';
    tipoReserva = '';
    estado = '';

    constructor(cliente, checkIn, checkOut, tipoReserva, estado) {
        this.id = uuidv4();
        this.cliente = cliente;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.tipoReserva = tipoReserva;
        this.estado = estado;
    }
}

module.exports = Reserva;
