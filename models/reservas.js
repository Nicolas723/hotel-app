const inquirer = require('inquirer');
const Reserva = require('./reserva');
const { guardarDB, cargarDB } = require('../helpers/guardarArchivo');
const { leerInput, subMenuRegistrarReservas } = require('../helpers/inquirer');

class reservas {

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
            console.log('Check In:'.blue);
            console.log(`Día (${('1-31'.green)}):`);
            const checkInDia = parseInt(await leerInput(), 10);

            console.log(`Mes (${('1-12'.green)}):`);
            const checkInMes = parseInt(await leerInput(), 10);

            console.log(`Año (${('2023-2024'.green)}):`);
            const checkInAño = parseInt(await leerInput(), 10);

            console.log('Check Out:'.blue);
            console.log(`Día (${('1-31'.green)}):`);
            const checkOutDia = parseInt(await leerInput(), 10);

            console.log(`Mes (${('1-12'.green)}):`);
            const checkOutMes = parseInt(await leerInput(), 10);

            console.log(`Año (${('2023-2024'.green)}):`);
            const checkOutAño = parseInt(await leerInput(), 10);


            if (
                !isNaN(checkInDia) && !isNaN(checkInMes) && !isNaN(checkInAño) &&
                !isNaN(checkOutDia) && !isNaN(checkOutMes) && !isNaN(checkOutAño) &&
                checkInDia >= 1 && checkInDia <= 31 &&
                checkInMes >= 1 && checkInMes <= 12 &&
                checkInAño >= 2023 && checkInAño <= 2024 &&
                checkOutDia >= 1 && checkOutDia <= 31 &&
                checkOutMes >= 1 && checkOutMes <= 12 &&
                checkOutAño >= 2023 && checkOutAño <= 2024
            ) {
                checkIn = new Date(checkInAño, checkInMes - 1, checkInDia);
                checkOut = new Date(checkOutAño, checkOutMes - 1, checkOutDia);

                if (!isNaN(checkIn) && !isNaN(checkOut) && checkOut > checkIn) {
                    fechasValidas = true;
                } else {
                    console.log('La fecha del check-out tiene que ser superior a la fecha del check-in');
                }
            } else {
                console.log('Valores de fecha fuera de rango o formato incorrecto.');
            }
        }

        let tipoReserva = null;
        let tipoReservaValido = false;

        while (!tipoReservaValido) {
            console.log('Tipo de reserva: ' + 'LITE'.blue + ' (sin servicios extra)'.red + ' / ' + 'PREMIUM'.green + ' (comidas, spa y wifi): '.red);
            const tipoReservaInput = await leerInput();
            tipoReserva = tipoReservaInput.toLowerCase();

            if (tipoReserva === 'lite' || tipoReserva === 'premium') {
                tipoReservaValido = true;
            } else {
                console.log('Tipo de reserva no válido. Debe ser "lite" o "premium".');
            }
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
    let colorTipoReserva = '';

    if (tipo === 'lite') {
        colorTipoReserva = 'blue';
    } else if (tipo === 'premium') {
        colorTipoReserva = 'green';
    }

    console.log(`Reservas de tipo ${tipo[colorTipoReserva]}:`);

    const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.tipoReserva === tipo && reserva.estado === 'activo');
    reservasFiltradas.forEach((reserva, index) => {
        console.log(`${index + 1}. Cliente: ${reserva.cliente[colorTipoReserva]}, Check-in: ${reserva.checkIn[colorTipoReserva]}, Check-out: ${reserva.checkOut[colorTipoReserva]}, Estado: ${reserva.estado[colorTipoReserva]}`);
    });
}

    listarReservasCanceladas() {
        console.log('Reservas Canceladas:');
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.estado === 'no activo');
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente.red}, Check-in: ${reserva.checkIn.red}, Check-out: ${reserva.checkOut.red}, Tipo de Reserva: ${reserva.tipoReserva.red}`);
        });
    }

    async cancelarReservas() {
        console.log('Reservas activas:');
        this.listarReservasPorEstado('activo');
        const reservasActivas = Object.values(this._listado).filter((reserva) => reserva.estado === 'activo');

        console.log('Ingrese los números de las reservas que desea cancelar (separados por coma):');
        const numerosListado = await leerInput();
        const numerosListadoArray = numerosListado.split(',').map(num => parseInt(num.trim()));

        let alMenosUnaCancelada = false;

        numerosListadoArray.forEach((numListado) => {
            const reserva = reservasActivas[numListado - 1]; // Restamos 1 para ajustar el índice
            if (reserva) {
                reserva.estado = 'no activo';
                alMenosUnaCancelada = true;
            } else {
                console.log(`No se pudo cancelar la reserva en la posición ${numListado}.`);
            }
        });

        if (alMenosUnaCancelada) {
            this.guardarReservas();
            console.log('Reservas canceladas con éxito.');
        } else {
            console.log('No se logró cancelar ninguna reserva.');
        }
    }


    listarReservasPorEstado(estado) {
        const reservasFiltradas = Object.values(this._listado).filter((reserva) => reserva.estado === estado);
        reservasFiltradas.forEach((reserva, index) => {
            console.log(`${index + 1}. Cliente: ${reserva.cliente.red}, Check-in: ${reserva.checkIn.red}, Check-out: ${reserva.checkOut.red}, Tipo de Reserva: ${reserva.tipoReserva.red}`);
        });
    }

    guardarReservas() {
        guardarDB(Object.values(this._listado));
    }
}

module.exports = reservas;
