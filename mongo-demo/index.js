const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
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

// *** Update Course -  Query first *** //
async function updateCourseQueryFirst(id) {
    const course = await Course.findById(id);

    if (!course) return;

    course.isPublished = true;
    course.author = 'Another Author';

    const result = await course.save();
    //console.log(result);

    return result;
}

// *** Update Course -  Update first *** //
async function updateCourseUpdateFirst(id) {
    const result = await Course.update({ _id: id }, {
        $set: {
            author: 'Mosh',
            isPublished: false
        }
    });

    return result;
}

// *** Update Course -  Update first *** //
async function updateCourseUpdateFirstFindByIdAndUpdate(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, {new: true});

    return course;
}

// *** Delete Course *** //
async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    return result;
}

async function run() {
    //const courses = await getCourses();
    //const courses = await getCoursesByPrice();
    //const courses = await getCoursesRegEx();
    //const courses = await createCourse();
    //const courses = await updateCourseQueryFirst('5b424f7b08e7a90e89153d0a');
    //const courses = await updateCourseUpdateFirst('5b424f7b08e7a90e89153d0a');
    //const courses = await updateCourseUpdateFirstFindByIdAndUpdate('5b424f7b08e7a90e89153d0a');
    const courses = await removeCourse('5b424f7b08e7a90e89153d0a');
    console.log(courses);
}

run();
