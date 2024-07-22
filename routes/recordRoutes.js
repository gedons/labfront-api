// /backend/routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {
  getRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');

router.get('/', authenticate, getRecords);
router.post('/', authenticate, addRecord);
router.put('/:id', authenticate, updateRecord); 
router.delete('/:id', authenticate, deleteRecord);

module.exports = router;
