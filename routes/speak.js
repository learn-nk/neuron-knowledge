const express = require('express');
const router = express.Router();

// Placeholder route
router.post('/', async (req, res) => {
  res.json({ message: 'Speak route coming soon' });
});

module.exports = router;