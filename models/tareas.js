const Reserva = require('./reserva');
const { guardarDB, cargarDB } = require('../helpers/guardarArchivo');
const { leerInput, subMenuRegistrarReservas, pausa } = require('../helpers/inquirer');

class Tareas {
    get listadoArr() {
        return Object.values(this._listado);
    }

    constructor() {
        this._listado = {};
        this.cargarTareas();
    }

    cargarTareas() {
        const tareasGuardadas = cargarDB();
        tareasGuardadas.forEach(tarea => {
            this._listado[tarea.id] = tarea;
        });
    }

    async registrarReserva() {
        console.log('Ingrese los datos de la reserva:');
        const cliente = await leerInput('Nombre del cliente:');
        const tipoReserva = await leerInput('Tipo de reserva (lite/premium):');
        const checkIn = await leerInput('Fecha de check-in (YYYY-MM-DD):');
        const checkOut = await leerInput('Fecha de check-out (YYYY-MM-DD):');

        // Aquí debes implementar la lógica para verificar la disponibilidad de habitaciones
        // y crear la reserva

        const nuevaReserva = new Reserva(cliente, checkIn, checkOut, tipoReserva, 'activo');
        this._listado[nuevaReserva.id] = nuevaReserva;
        this.guardarTareas();
        console.log('Reserva creada con éxito.');
    }

    verReservas() {
        return subMenuRegistrarReservas().then(async (respuesta) => {
            const opcion = respuesta.tipoReserva;
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
        });
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

        const ids = await leerInput('Ingrese los números de las reservas que desea cancelar (separados por coma):');
        const idsArray = ids.split(',').map(id => id.trim());

        idsArray.forEach(id => {
            if (this._listado[id] && this._listado[id].estado === 'activo') {
                this._listado[id].estado = 'no activo';
            }
        });

        this.guardarTareas();
        console.log('Reservas canceladas con éxito.');
    }

    listarReservasPorEstado(estado) {
        console.log(`Reservas ${estado}:`);
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.estado === estado);
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}`);
        });
    }

    guardarTareas() {
        guardarDB(Object.values(this._listado));
    }
}

module.exports = Tareas;
