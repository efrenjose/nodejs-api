const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genres');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function ValidateMovie(movie) {
    const schema = {
        title: Joi.string().min(1).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255),
    }

    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.Validate = ValidateMovie;