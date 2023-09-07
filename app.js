const { inquirerMenu, pausa } = require('./helpers/inquirer');
const Reservas = require('./models/reservas');

console.clear();

const main = async () => {
    let opt = '';
    const reservas = new Reservas();
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                await reservas.registrarReserva();
                await pausa();
                break;

            case '2':
                await reservas.verReservas();
                await pausa();
                break;

            case '3':
                await reservas.cancelarReservas();
                await pausa();
                break;

            case '0':
                break;

            default:
                console.log('Opción no válida. Por favor, seleccione una opción válida.');
                await pausa();
                break;
        }
    } while (opt !== '0');
};

main();
