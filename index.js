'use strict';

const IS_DEBUG = false;

const fetch       = require('node-fetch');
const initializer = require('./modules/utils/initializer');

initializer.logger();

const dgram  = require('dgram');
const server = dgram.createSocket('udp4');

module.exports = {
    server: server
};

const EventHandler = require('./modules/EventHandler');

// TODO: 非Global化
global.clients = [];

initializer.dotenv();
const { PORT, DISCORD_BOT_URL } = process.env;

server.on('listening', () => {
    const address = server.address();
    console.info(`Server listening on ${address.address}:${address.port}`);

    // Discordボットにステータス設定
    const type = IS_DEBUG ? 'debug' : 'start';
    postSetActivity({ type: type });
});

server.on('message', (msg, info) => {
    EventHandler.switchMessage(msg.toString(), info);
});

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.on('close', () => {
    console.info('Server closed');
    process.exit(0);
});

server.bind(PORT);

// 終了時にDiscordボットのステータス解除
process
    .on('exit', async () => await postSetActivity({ type: 'stop' }))
    .on('SIGTERM', async () => await postSetActivity({ type: 'stop' }))
    .on('SIGINT', async () => {
        await postSetActivity({ type: 'stop' });
        process.exit(0);
    });

/**
 * Discordボットのアクティビティへの稼働状況設定用リクエストをPOSTする
 * @param {Object} body activityOptions
 * @return {*|Promise<Response>}
 */
function postSetActivity(body) {
    return fetch(`${DISCORD_BOT_URL}/setActivity`, {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
        },
        body   : JSON.stringify(body)
    });
}
