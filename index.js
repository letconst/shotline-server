const dgram = require('dgram');

require('./modules/utils/initializer')();

const server  = dgram.createSocket('udp4');
const clients = [];

const { PORT, MAX_CONNECTIONS } = process.env;

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, info) => {

});

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.bind(PORT);
