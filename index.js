'use strict';

const dgram  = require('dgram');
const server = dgram.createSocket('udp4');

module.exports = {
    server: server
}

const EventHandler = require('./modules/EventHandler');

// TODO: 非Global化
global.clients = [];

require('./modules/utils/initializer')();
const { PORT } = process.env;

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, info) => {
    EventHandler.switchMessage(msg.toString(), info);
});

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.bind(PORT);
