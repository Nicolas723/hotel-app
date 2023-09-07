const { v4: uuidv4 } = require('uuid');

class Reserva {
    id = '';
    cliente = '';
    checkIn = null;
    checkOut = null;
    tipoReserva = '';
    estado = '';

    constructor(cliente, checkIn, checkOut, tipoReserva, estado) {
        this.id = uuidv4();
        this.cliente = cliente;
        if (this.esFechaValida(checkIn) && this.esFechaValida(checkOut)) {
            this.checkIn = checkIn;
            this.checkOut = checkOut;
        } else {
            throw new Error('Las fechas de check-in y check-out son inválidas.');
        }

        if (this.esTipoReservaValido(tipoReserva)) {
            this.tipoReserva = tipoReserva;
        } else {
            throw new Error('El tipo de reserva no es válido.');
        }
        if (this.esEstadoValido(estado)) {
            this.estado = estado;
        } else {
            throw new Error('El estado no es válido.');
        }
    }

    esFechaValida(fecha) {
        return fecha instanceof Date && !isNaN(fecha);
    }

    esTipoReservaValido(tipo) {
        return tipo === 'lite' || tipo === 'premium';
    }

    esEstadoValido(estado) {
        return estado === 'activo' || estado === 'no activo';
    }
}

module.exports = Reserva;
