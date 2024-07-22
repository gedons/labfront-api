const Remedial = require('../models/Remedial');
const PDFDocument = require('pdfkit');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


exports.registerStudent = async (req, res) => {
  const { fullName, email, courseOfStudy, department, academicSession, matricNumber, mobileNumber, courses, totalCoursesFailed } = req.body;
  try {
    const remedial = new Remedial({ fullName, email, courseOfStudy, department, academicSession, matricNumber, mobileNumber, courses, totalCoursesFailed });
    await remedial.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentResults = async (req, res) => {
    const { matricNumber } = req.query;  
    try {
      const remedial = await Remedial.findOne({ matricNumber });
      if (!remedial) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(remedial);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Upload document and read contents
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const content = pdfData.text;

    // Save content to database or process as needed
    res.status(200).json({ message: 'File uploaded successfully', content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Remedial.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateStudentPDF = async (req, res) => {
  const { matricNumber } = req.query;

  try {
    const remedial = await Remedial.findOne({ matricNumber });
    if (!remedial) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Sanitize the file path
    const sanitizedMatricNumber = matricNumber.replace(/\//g, '_');

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    const pdfDirectory = path.join(__dirname, '../pdfs');
    const filePath = path.join(pdfDirectory, `${sanitizedMatricNumber}.pdf`);

    // Ensure the PDF directory exists
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory);
    }

    // Pipe the PDF into a writable stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF content
    doc
      .fontSize(15)
      .fillColor('#007BFF')
      .text(`Student Details - ${remedial.fullName}`, { align: 'center' })
      .moveDown(1.5);

    // Personal Details
    doc
      .fontSize(16)
      .fillColor('black')
      .text(`Full Name: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.fullName}`)
      .font('Helvetica')
      .text(`Email: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.email}`)
      .font('Helvetica')
      .text(`Course of Study: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.courseOfStudy}`)
      .font('Helvetica')
      .text(`Department: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.department}`)
      .font('Helvetica')
      .text(`Academic Session: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.academicSession}`)
      .font('Helvetica')
      .text(`Matric Number: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.matricNumber}`)
      .font('Helvetica')
      .text(`Mobile Number: `, { continued: true })
      .font('Helvetica-Bold')
      .text(`${remedial.mobileNumber}`)
      .moveDown(1.5);

    // Remedial Courses
    doc
      .fontSize(18)
      .fillColor('#007BFF')
      .text('Courses:')
      .moveDown(1);

    remedial.courses.forEach((course, index) => {
      doc
        .fontSize(14)
        .fillColor('black')
        .text(`Course ${index + 1}:`, { continued: true })
        .font('Helvetica-Bold')
        .text(` ${course.courseCode} - ${course.courseTitle}`)
        .font('Helvetica')
        .text(`Credit Unit: `, { continued: true })
        .font('Helvetica-Bold')
        .text(`${course.courseCreditUnit}`)
        .font('Helvetica')
        .text(`Lecturer: `, { continued: true })
        .font('Helvetica-Bold')
        .text(`${course.courseLecturer}`)
        .font('Helvetica')
        .text(`Year of Exam: `, { continued: true })
        .font('Helvetica-Bold')
        .text(`${course.yearOfExam}`)
        .font('Helvetica')
        .text(`Grade: `, { continued: true })
        .font('Helvetica-Bold')
        .text(`${course.grade}`)
        .moveDown(0.5);
    });

    // Finalize the PDF
    doc.end();

    // Stream the PDF to the client
    stream.on('finish', function() {
      res.download(filePath, `${sanitizedMatricNumber}_result.pdf`, (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
        }
        fs.unlinkSync(filePath); // Delete the file after sending
      });
    });

    stream.on('error', function(err) {
      console.error('Stream error:', err);
      res.status(500).json({ error: 'Error generating PDF' });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.upload = upload;


  
