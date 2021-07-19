const log4js = require('log4js');
log4js.configure('config/log4js.config.json');

module.exports = {
    dotenv: () => {
        if (typeof process.env.IS_AVAILABLE === 'undefined') {
            require('dotenv').config();
        }
    },

    logger: () => {
        const logger = log4js.getLogger('console');

        console.info  = logger.info.bind(logger);
        console.warn  = logger.warn.bind(logger);
        console.error = logger.error.bind(logger);
        console.debug = logger.debug.bind(logger);
        console.trace = logger.trace.bind(logger);
    }
};
