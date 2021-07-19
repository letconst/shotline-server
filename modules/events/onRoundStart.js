const ItemManager = require('../ItemManager');

/**
 * ラウンド開始時の処理
 * @param _
 * @param __
 * @param ___
 */
module.exports = (_, __, ___) => {
    console.info('Round started');

    ItemManager.startGenerate();
};
