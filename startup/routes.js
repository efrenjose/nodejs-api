const express = require('express');
const genres = require('../routes/genres')
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const authentication = require('../routes/authentication');
const error = require('../middleware/error')

module.export = function(app) {
    app.use(express.json()); //parses request object into json and sets req.body
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', authentication);
    app.use(error);
}