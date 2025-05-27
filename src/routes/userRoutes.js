const express = require('express');
const router = express.Router();

// Temporary route handler until we recreate the controllers
router.post('/register', (req, res) => {
  res.status(200).json({ success: true, message: 'User registration endpoint' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ success: true, message: 'User login endpoint' });
});

module.exports = router; 