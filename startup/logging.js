const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.file({ filename: 'uncaughtExceptions.log'}));
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly', level: 'error' });
    
    //Log unhandled rejections outside of the express context
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    })
}