const genres = require('./routes/genres')
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json()); //parses request object into json and sets req.body
app.use('/api/genres', genres);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));