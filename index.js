'use strict';

const dgram        = require('dgram');
const EventHandler = require('./modules/EventHandler');

const server       = dgram.createSocket('udp4');
const eventHandler = new EventHandler(server);

global.clients = [];

require('./modules/utils/initializer')();
const { PORT } = process.env;

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, info) => {
    eventHandler.switchMessage(msg.toString(), info);
});

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.bind(PORT);
