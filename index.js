require('dotenv').config();
require('./src/banner');
const express = require('express');
const app = express();
var logger = require('./LogConfig');
var cors = require('cors');
/***** LIbs Swagger *******/
var YAML = require('yamljs');
var swaggerUi = require('swagger-ui-express');
//var swaggerDocument = YAML.load('./doc/swagger.yaml');
var multer = require('multer');
var upload = multer();
var mth40 = require ('./src/configs');

/*** Controladores */
var configController = require('./src/controller/ConfigController');

/** Factorías */
var loadSwagger = require('./loadSwagger');
var redisFactory = require('./src/factories/RedisFactory');

logger.debug (mth40);

app.use(
    cors({
        credentials: true,
        origin: true
    })
    );
app.options('*', cors());

app.get('/', (req, res) => 
    res.redirect('/api-docs')
);

app.use('/config', configController);

const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })


heroku.get('/apps').then(apps => {
    logger.info(apps);
})


app.listen(mth40.config.PORT, async () => {
    logger.debug("mth40-api starting on port="+mth40.config.PORT);
    const docSample = await loadSwagger.load('./doc/index.yaml');
    const swaggerDocument = YAML.parse(docSample);
    const redisPromised = redisFactory.connect();

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    Promise.all([redisPromised]).then(respVal => {
        console.log("********************************************************");
        //console.log(respVal);
        console.log('************* Server running on port ' + mth40.config.PORT + " **************");
        console.log("********************************************************");
    }).catch(reason => { 
        logger.error(reason);
    });
});