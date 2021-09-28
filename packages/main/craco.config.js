const path = require('path')

/* craco.config.js */
module.exports = {
    webpack: {
        alias: {
            react: path.join(__dirname, "./node_modules/react"),
        }
    }
};
