const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.Now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

// *** Get Courses *** //
async function getCourses() {
    return await Course
    .find({ isPublished: true, tags: 'backend'})
    .sort({ name: 1})
    .select({ name: 1, author: 1})
}

// *** Get Courses - Sort them by price *** //
async function getCoursesByPrice() {
    return await Course
    .find({ isPublished: true })
    .or([ { tags: 'frontend' }, { tags: 'backend' } ])
    .sort('-price')
    .select('name author price');
}

// *** Get Courses - Use regular expression *** //
async function getCoursesRegEx() {
    return await Course
    .find({ isPublished: true })
    .or([  
      { price: { $gte: 15 } },
      { name: /.*by.*/i }
    ])
    .sort('-price')
    .select('name author price');
}

// *** Create Course *** //
async function createCourse() {
    const course = new Course({
        name: 'Node.js Course',
        author: 'Mosh',
        tags: ['node', 'backend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result);
}

async function run() {
    const courses  = await getCourses();
    const courses  = await getCoursesByPrice();
    const courses  = await getCoursesRegEx();
    const courses  = await createCourse();
    console.log(courses);
}

run();
