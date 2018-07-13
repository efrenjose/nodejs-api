const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255},
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.Now },
    isPublished: Boolean,
    price: {
        type: Number,
        min: 10,
        maz: 200,
        required: function() { return this.isPublished; }
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    }
});

const Course = mongoose.model('Course', courseSchema);

// *** Create Course *** //
async function createCourse() {
    const course = new Course({
        author: 'Mosh',
        tags: ['node', 'backend'],
        isPublished: true,
        category: 'some category'
    });

    try {
        // course.validate((err) => {
        //     if (err) { }
        // })

        const result = await course.save();
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

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
    const courses = await createCourse();
    //const courses = await updateCourseQueryFirst('5b424f7b08e7a90e89153d0a');
    //const courses = await updateCourseUpdateFirst('5b424f7b08e7a90e89153d0a');
    //const courses = await updateCourseUpdateFirstFindByIdAndUpdate('5b424f7b08e7a90e89153d0a');
    //const courses = await removeCourse('5b424f7b08e7a90e89153d0a');
    console.log(courses);
}

run();
