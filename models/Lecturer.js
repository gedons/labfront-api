const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const lecturerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

lecturerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);
module.exports = Lecturer;
