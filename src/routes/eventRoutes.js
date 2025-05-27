const express = require('express');
const router = express.Router();

// Temporary route handler until we recreate the controllers
router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Get all events endpoint' });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Create event endpoint' });
});

module.exports = router; 