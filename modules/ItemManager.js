const NetworkHandler = require('./utils/NetworkHandler');
const { server }     = require('../index');
const { eventType }  = require('./definitions/Definitions');

class ItemManager {
    /**
     * 生成間隔 (ms)。ホストとの接続時に数値をもらう。
     * @type {number}
     */
    #generateInterval;

    #expected;
    #timer;

    /**
     * 生成処理中か
     * @type {boolean}
     */
    #isGenerating;

    /**
     * このインスタンスが保持されているルーム
     * @type {Room}
     */
    #room;

    /**
     * @param {Room} room
     */
    constructor(room) {
        /**
         * 現在生成されているアイテムの個数
         * @type {number}
         */
        this.generatedCount = 0;

        /**
         * 生成する最大個数。ホストとの接続時に数値をもらう。
         * @type {number}
         */
        this.maxGenerateCount = 0;

        this.#room = room;
    }

    set generateInterval(interval) {
        this.#generateInterval = interval * 1000;
    }

    /**
     * アイテムの自動生成通信を開始する
     */
    startGenerate() {
        if (this.#isGenerating) return;

        this.#expected     = Date.now() + this.#generateInterval;
        this.#timer        = setTimeout(this.step.bind(this), this.#generateInterval);
        this.#isGenerating = true;
    }

    /**
     * アイテムの自動生成通信を停止する
     */
    stopGenerate() {
        clearTimeout(this.#timer);

        this.#isGenerating = false;
    }

    /**
     * 指定秒おきに、UNIX時間をブロードキャストする
     */
    step() {
        const dt = Date.now() - this.#expected;

        // 最大個数に到達してたら終了
        if (this.generatedCount === this.maxGenerateCount) {
            this.#isGenerating = false;

            return;
        }

        const data = {
            Type: eventType.ItemGenerate,
            Seed: Math.floor(Date.now() / 1000) // intがオーバーフローするため、秒に丸める
        };

        NetworkHandler.broadcastToRoom(data, server, this.#room);

        this.generatedCount++;

        this.#expected += this.#generateInterval;
        this.#timer = setTimeout(this.step.bind(this), Math.max(0, this.#generateInterval - dt));
    }

    /**
     * 生成状況をリセットする
     */
    reset() {
        this.stopGenerate();
        this.generatedCount = 0;
    }
}

module.exports = ItemManager;
