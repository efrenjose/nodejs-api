const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function updateCourse(courseId) {
    const course = await Course.findById(courseId);
    course.author.name = "efren";
    course.save();
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}
async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

removeAuthor('5b738a43498a5fa30ea061b6', '5b738b70a11d3aa34e9807cc');

//addAuthor('5b738a43498a5fa30ea061b6', new Author({ name: 'Efren'}));

/*createCourse('Node Course', [
  new Author({ name: 'Mosh' }),
  new Author({ name: 'John  ' }),
]);*/

//updateCourse('5b4fd1df981d401571aa82d4');
