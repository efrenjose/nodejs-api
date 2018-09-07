require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error')
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres')
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const authentication = require('./routes/authentication');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

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

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json()); //parses request object into json and sets req.body
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', authentication);

app.use(error);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));