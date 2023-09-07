const inquirer = require('inquirer');
const Reserva = require('./reserva');
const { guardarDB, cargarDB } = require('../helpers/guardarArchivo');
const { leerInput, subMenuRegistrarReservas } = require('../helpers/inquirer');

class Tareas {

    get listadoArr() {
        return Object.values(this._listado);
    }

    constructor() {
        this._listado = {};
        this.cargarReservas();
    }

    cargarReservas() {
        const reservasGuardadas = cargarDB();
        reservasGuardadas.forEach(reserva => {
            this._listado[reserva.id] = reserva;
        });
    }

    async registrarReserva() {
        console.log('Ingrese los datos de la reserva:');
        console.log('Nombre del cliente:');
        const cliente = await leerInput();

        let checkIn = null;
        let checkOut = null;
        let fechasValidas = false;
        while (!fechasValidas) {
            console.log('Check In:');
            console.log('Día (1-31): ');
            const checkInDia = await leerInput();
            console.log('Mes (1-12): ');
            const checkInMes = await leerInput();
            console.log('Año: ');
            const checkInAnio = await leerInput();

            console.log('Check Out:');
            console.log('Día (1-31): ');
            const checkOutDia = await leerInput();
            console.log('Mes (1-12): ');
            const checkOutMes = await leerInput();
            console.log('Año: ');
            const checkOutAnio = await leerInput();

            checkIn = new Date(checkInAnio, checkInMes - 1, checkInDia);
            checkOut = new Date(checkOutAnio, checkOutMes - 1, checkOutDia);

            if (!isNaN(checkIn) && !isNaN(checkOut) && checkOut > checkIn) {
                fechasValidas = true;
            } else {
                console.log('La fecha del check-out tiene que ser superior a la fecha del check-in');
            }
        }
        console.log('Tipo de reserva (lite/premium): ');
        const tipoReserva = await leerInput();

        if (tipoReserva !== 'lite' && tipoReserva !== 'premium') {
            console.log('Tipo de reserva no válido. Debe ser "lite" o "premium".');
        }


        const nuevaReserva = new Reserva(cliente, checkIn, checkOut, tipoReserva, 'activo');
        this._listado[nuevaReserva.id] = nuevaReserva;
        this.guardarReservas();
        console.log('Reserva creada con éxito.');

    }

    async verReservas() {
        const respuestas = await inquirer.prompt(subMenuRegistrarReservas);
        const opcion = respuestas.tipoReserva;
        switch (opcion) {
            case 'lite':
                this.listarReservasPorTipo('lite');
                break;
            case 'premium':
                this.listarReservasPorTipo('premium');
                break;
            case 'canceladas':
                this.listarReservasCanceladas();
                break;
            default:
                console.log('Opción no válida.');
                break;
        }
    }

    listarReservasPorTipo(tipo) {
        console.log(`Reservas de tipo ${tipo}:`);
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.tipoReserva === tipo);
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}, Estado: ${reserva.estado}`);
        });
    }

    listarReservasCanceladas() {
        console.log('Reservas Canceladas:');
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.estado === 'no activo');
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}`);
        });
    }

    async cancelarReservas() {
        console.log('Reservas activas:');
        this.listarReservasPorEstado('activo');

        console.log('Ingrese los números de las reservas que desea cancelar (separados por coma):');
        const ids = await leerInput();
        const idsArray = ids.split(',').map(id => id.trim());

        idsArray.forEach(id => {
            if (this._listado[id] && this._listado[id].estado === 'activo') {
                this._listado[id].estado = 'no activo';
            }
        });

        this.guardarReservas();
        console.log('Reservas canceladas con éxito.');
    }

    listarReservasPorEstado(estado) {
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.estado === estado);
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}, Estado: ${reserva.estado}`);
        });
    }

    guardarReservas() {
        guardarDB(Object.values(this._listado));
    }
}

module.exports = Tareas;
