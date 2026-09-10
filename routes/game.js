const express = require('express');
const router = express.Router();

const MISSIONS = [
  { id: 'delivery_1', title: 'Pizza Delivery', description: 'Deliver pizza to the penthouse', reward: 500, time: 600 },
  { id: 'escort_1', title: 'Escort VIP', description: 'Escort a VIP to the casino', reward: 1000, time: 900 },
  { id: 'race_1', title: 'Street Race', description: 'Win a street race for cash', reward: 1500, time: 300 },
  { id: 'heist_1', title: 'Diamond Heist', description: 'Steal diamonds from the museum', reward: 5000, time: 1800 },
  { id: 'assassination_1', title: 'Target Elimination', description: 'Remove a target', reward: 2000, time: 600 }
];

const JOBS = [
  { id: 'taxi_driver', title: 'Taxi Driver', salary: 50, hoursPerDay: 8 },
  { id: 'chef', title: 'Chef', salary: 100, hoursPerDay: 8 },
  { id: 'bouncer', title: 'Bouncer', salary: 75, hoursPerDay: 6 },
  { id: 'cop', title: 'Police Officer', salary: 150, hoursPerDay: 8 },
  { id: 'delivery', title: 'Delivery Driver', salary: 40, hoursPerDay: 8 }
];

// Get missions
router.get('/missions', (req, res) => {
  res.json(MISSIONS);
});

// Accept mission
router.post('/missions/:missionId/accept', (req, res) => {
  const mission = MISSIONS.find(m => m.id === req.params.missionId);
  if (!mission) return res.status(404).json({ error: 'Mission not found' });
  res.json({ status: 'Mission accepted', mission });
});

// Get jobs
router.get('/jobs', (req, res) => {
  res.json(JOBS);
});

// Start job
router.post('/jobs/:jobId/start', (req, res) => {
  const job = JOBS.find(j => j.id === req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ status: 'Job started', job, startTime: new Date() });
});

// Get locations
router.get('/locations', (req, res) => {
  const locations = [
    { id: 'downtown', name: 'Downtown', type: 'city' },
    { id: 'beach', name: 'Beach', type: 'beach' },
    { id: 'airport', name: 'Airport', type: 'airport' },
    { id: 'casino', name: 'Casino', type: 'nightlife' },
    { id: 'suburbs', name: 'Suburbs', type: 'residential' }
  ];
  res.json(locations);
});

module.exports = router;
