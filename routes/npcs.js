const express = require('express');
const router = express.Router();

const NPCs = [
  { id: 'npc_1', name: 'Sarah', role: 'bartender', location: 'Downtown Bar', voiceType: 'female' },
  { id: 'npc_2', name: 'John', role: 'taxi_driver', location: 'Downtown', voiceType: 'male' },
  { id: 'npc_3', name: 'Maria', role: 'chef', location: 'Beach Restaurant', voiceType: 'female' },
  { id: 'npc_4', name: 'Alex', role: 'car_dealer', location: 'Car Lot', voiceType: 'male' },
  { id: 'npc_5', name: 'Jessica', role: 'bartender', location: 'Casino Bar', voiceType: 'female' },
  { id: 'npc_6', name: 'Marcus', role: 'bouncer', location: 'Nightclub', voiceType: 'male' }
];

// Get all NPCs
router.get('/', (req, res) => {
  res.json(NPCs);
});

// Get NPC by ID
router.get('/:npcId', (req, res) => {
  const npc = NPCs.find(n => n.id === req.params.npcId);
  if (!npc) return res.status(404).json({ error: 'NPC not found' });
  res.json(npc);
});

// Start conversation with NPC
router.post('/:npcId/chat', (req, res) => {
  const { message } = req.body;
  const npc = NPCs.find(n => n.id === req.params.npcId);
  if (!npc) return res.status(404).json({ error: 'NPC not found' });
  
  // AI dialogue response (placeholder)
  const responses = [
    `Hey! I'm ${npc.name}. What can I help you with?`,
    `Nice to meet you!`,
    `I'm busy right now, come back later.`,
    `Want to hear about my job? I'm a ${npc.role}.`
  ];
  
  res.json({
    npcId: npc.id,
    npcName: npc.name,
    npcResponse: responses[Math.floor(Math.random() * responses.length)]
  });
});

module.exports = router;
