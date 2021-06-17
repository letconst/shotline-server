module.exports = () => {
    if (typeof process.env.IS_AVAILABLE === 'undefined') {
        require('dotenv').config();
    }
}
