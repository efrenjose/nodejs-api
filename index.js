const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const logger = require('./middleware/logger');
const authenticate = require('./authentication');
const home = require('./routes/home');
const courses = require('./routes/courses')
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); //parses request object into json and sets req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', home);
app.use('/api/courses', courses);

//Config
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Server password: ' + config.get('mail.password'));
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    startupDebugger('Morgan enabled...');
}
app.use(logger);
app.use(authenticate);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));