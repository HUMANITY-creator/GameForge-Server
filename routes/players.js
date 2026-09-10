const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Get all players
router.get('/', (req, res) => {
  res.json({ message: 'Players endpoint', endpoint: '/api/players' });
});

// Create player
router.post('/create', (req, res) => {
  const { name } = req.body;
  const playerId = uuidv4();
  res.json({
    playerId,
    name,
    health: 100,
    money: 5000,
    level: 1,
    createdAt: new Date()
  });
});

// Get player stats
router.get('/:playerId', (req, res) => {
  const { playerId } = req.params;
  res.json({
    playerId,
    health: 100,
    money: 5000,
    level: 1,
    location: 'Downtown'
  });
});

module.exports = router;
