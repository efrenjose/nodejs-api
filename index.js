const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const logger = require('./logger');
const authenticate = require('./authentication');
const express = require('express');
const app = express();

app.use(express.json()); //parses request object into json and sets req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

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

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('Course not found.');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    
    //validate
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error);

    //create
    course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    
    //find course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found.');

    //validate
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error);

    //update
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //find course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening in port ${port}...`));