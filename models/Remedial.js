const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: String,
  courseTitle: String,
  courseCreditUnit: Number,
  courseLecturer: String,
  yearOfExam: Number,
  grade: String,
});

const remedialSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  courseOfStudy: String,
  department: String,
  academicSession: String,
  matricNumber: String,
  mobileNumber: String,
  courses: [courseSchema],
  totalCoursesFailed: Number,
});

const Remedial = mongoose.model('Remedial', remedialSchema);
module.exports = Remedial;
