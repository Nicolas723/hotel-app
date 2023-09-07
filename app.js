const colors = require('colors');
const { inquirerMenu, pausa } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main = async () => {
    let opt = '';
    const tareas = new Tareas();
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                await tareas.registrarReserva();
                await pausa();
                break;

            case '2':
                await tareas.verReservas();
                await pausa();
                break;

            case '3':
                await tareas.cancelarReservas();
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
