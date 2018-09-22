require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();

//Log uncaught exceptions outside of the express context
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
})

//Log unhandled rejections outside of the express context
process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
})

winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly', level: 'error' });

if (!config.get('jwtPrivateKey')) {
    console.log('fatal error: jwtPrivateKey is not defined.');
    process.exit(1);
}



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));