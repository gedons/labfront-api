const Lecturer = require('../models/Lecturer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const lecturer = new Lecturer({ email, password });
    await lecturer.save();
    res.status(201).json({ message: 'Lecturer registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const lecturer = await Lecturer.findOne({ email });
    if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: lecturer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
