// /backend/controllers/recordController.js
const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRecord = async (req, res) => {
  const {
    title,
    description,
    experimentName,
    experimentType,
    sampleName,
    sampleSource,
    equipmentName,
    procedureStep,
    observations,
  } = req.body;

  try {
    const newRecord = new Record({
      title,
      description,
      experimentName,
      experimentType,
      sampleName,
      sampleSource,
      equipmentName,
      procedureStep,
      observations,
    });
    const savedRecord = await newRecord.save();
    res.json(savedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  const {
    title,
    description,
    experimentName,
    experimentType,
    sampleName,
    sampleSource,
    equipmentName,
    procedureStep,
    observations,
  } = req.body;

  try {
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        experimentName,
        experimentType,
        sampleName,
        sampleSource,
        equipmentName,
        procedureStep,
        observations,
      },
      { new: true }
    );
    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);
    res.json(deletedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
