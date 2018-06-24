const genres = require('./routes/genres')
const express = require('express');
const app = express();

app.use(express.json()); //parses request object into json and sets req.body
app.use('/api/genres', genres);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));