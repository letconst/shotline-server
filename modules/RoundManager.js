let NetworkHandler  = require('./utils/NetworkHandler');
const { server }    = require('../index');
const { eventType } = require('./definitions/Definitions');

class RoundManager {
    /**
     * サドンデスを開始する経過時間
     */
    #suddenDeathStartTime;

    #timer;

    /**
     * サドンデス開始までのカウントを行っているか
     * @type {boolean}
     */
    #isNowCountDownSudden;
    /**
     * このインスタンスが保持されているルーム
     * @type {Room}
     */
    #room;

    /**
     * @param {Room} room
     */
    constructor(room) {
        this.#suddenDeathStartTime = 60000;
        this.#room                 = room;
    }

    /**
     * サドンデスのカウントを開始する
     */
    startSuddenDeathCount() {
        if (this.#isNowCountDownSudden) return;

        this.#timer                = setTimeout(this.broadcastSuddenDeathReq.bind(this), this.#suddenDeathStartTime);
        this.#isNowCountDownSudden = true;
    }

    /**
     * サドンデスのカウントを停止する
     */
    stopSuddenDeathCount() {
        clearTimeout(this.#timer);

        this.#isNowCountDownSudden = false;
    }

    /**
     * サドンデス開始をリクエストする
     */
    broadcastSuddenDeathReq() {
        const data = {
            Type: eventType.SuddenDeathStart
        };

        if (!Object.keys(NetworkHandler).length) {
            NetworkHandler = require('./utils/NetworkHandler');
        }

        NetworkHandler.broadcastToRoom(data, server, this.#room);
    }
}

module.exports = RoundManager;