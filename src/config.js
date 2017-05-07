import yargs from 'yargs';

const pkg = require('../package.json');

const config =
    yargs
        .usage(pkg.name + ' ' + pkg.version + '\n' + pkg.description + '\n\nUsage: $0 [options]')
        //.describe('v', 'possible values: "error", "warn", "info", "debug"')
        .describe('n', 'instance name. used as mqtt client id and as prefix for connected topic')
        .describe('m', 'hostname or ip address of Atlona HDMI matrix')
        .describe('u', 'mqtt broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
        .describe('h', 'show help')
        .alias({
            'h': 'help',
            'n': 'name',
            'm': 'matrix',
            'u': 'url',
            //'v': 'verbosity'
        })
        .default({
            'u': 'mqtt://127.0.0.1',
            'n': 'atlonamatrix',
            //'v': 'info'
        })
        //.config('config')
        .version()
        .demand('matrix')
        .help('help')
        .argv;

export {
    config as default
}

