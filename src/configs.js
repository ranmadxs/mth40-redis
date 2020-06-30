const fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');
var logger = require('../LogConfig');

let mth40 = {};
try {
    var filename = path.join(__dirname, 'resources/application.yml');
    let fileContents = fs.readFileSync(filename, 'utf8');
    let mth40Properties = yaml.safeLoad(fileContents);

    mth40 = {
        config : {
            PORT : process.env.PORT || mth40Properties.api.port,
            REDIS_URL : process.env.REDIS_URL || mth40Properties.redis.url,
        },
        properties: mth40Properties
    }
} catch (e) {
    logger.error(e);
}

module.exports = mth40;