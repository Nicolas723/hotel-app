const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué deseas hacer?',
        choices: [
            {
                value: '1',
                name: `${'1.'.red} ${'Registrar Reservas'.yellow}`
            },
            {
                value: '2',
                name: `${'2.'.red} ${'Ver Reservas'.yellow}`
            },
            {
                value: '3',
                name: `${'3.'.red} ${'Cancelar Reservas'.yellow}`
            },
            {
                value: '0',
                name: `${'0.'.red} ${'Salir'.yellow}`
            },
        ],
    },
];

const subMenuRegistrarReservas = [
    {
        type: 'list',
        name: 'tipoReserva',
        message: 'Selecciona el tipo de reserva:',
        choices: [
            {
                value: 'lite',
                name: `${'Lite'.blue}`
            },
            {
                value: 'premium',
                name: `${'Premium'.green}`
            },
            {
                value: 'volver',
                name: `${'Volver'.gray}`
            },
        ],
    },
];

const inquirerMenu = async () => {
    console.log("=======================================".red);
    console.log("         SELECCIONA UNA OPCIÓN".yellow);
    console.log("=======================================".red);

    let otp = '';

    const opt = await inquirer.prompt(preguntas).then(data => {
        otp = data['opcion']
    });

    return otp;
}

const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `\nPresione ${'ENTER'.red} para continuar \n`
        }
    ]

    let pau = '';
    console.log('\n');
    await inquirer.prompt(question).then(data => {
        pau = data['enter']
    });
}

const leerInput = async () => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message: ' ',
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]

    let leer = '';
    await inquirer.prompt(question).then(data => {
        leer = data['desc'];
    });

    return leer;
}

module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    subMenuRegistrarReservas
}
