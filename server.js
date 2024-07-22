// server/server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const dotenv = require('dotenv');
const lecturerRoutes = require('./routes/lecturerRoutes');
const remedialRoutes = require('./routes/remedialRoutes');
const recordRoutes = require('./routes/recordRoutes');


dotenv.config();

const corsOptions = {
    //origin: 'https://cartrk.vercel.app', 
    origin: 'http://localhost:5173', 
    credentials: true,
  };
  

const app = express();
app.use(express.json());
app.use(cors(corsOptions));


// Connect Database
connectDB();


// Init Middleware
app.use(express.json({ extended: false }));

app.use('/api/lecturer', lecturerRoutes);
app.use('/api/remedial', remedialRoutes);
app.use('/api/records', recordRoutes);

 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

 
