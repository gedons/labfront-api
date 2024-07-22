// /backend/models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experimentName: { type: String, required: true },
  experimentType: { type: String, required: true },
  sampleName: { type: String, required: true },
  sampleSource: { type: String, required: true },
  equipmentName: { type: String, required: true },
  procedureStep: { type: String, required: true },
  observations: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Record', recordSchema);
