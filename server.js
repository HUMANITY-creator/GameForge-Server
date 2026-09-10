const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gameforge';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Import Routes
const playerRoutes = require('./routes/players');
const npcRoutes = require('./routes/npcs');
const voiceRoutes = require('./routes/voice');
const gameRoutes = require('./routes/game');

// Use Routes
app.use('/api/players', playerRoutes);
app.use('/api/npcs', npcRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/game', gameRoutes);

// Game State Manager
class GameStateManager {
  constructor() {
    this.players = new Map();
    this.npcs = new Map();
    this.voiceChannels = new Map();
    this.initializeNPCs();
  }

  initializeNPCs() {
    const npcData = [
      { id: 'npc_1', name: 'Sarah', role: 'bartender', location: 'Downtown Bar', voiceType: 'female' },
      { id: 'npc_2', name: 'John', role: 'taxi_driver', location: 'Downtown', voiceType: 'male' },
      { id: 'npc_3', name: 'Maria', role: 'chef', location: 'Beach Restaurant', voiceType: 'female' },
      { id: 'npc_4', name: 'Alex', role: 'car_dealer', location: 'Car Lot', voiceType: 'male' },
      { id: 'npc_5', name: 'Jessica', role: 'bartender', location: 'Casino Bar', voiceType: 'female' },
      { id: 'npc_6', name: 'Marcus', role: 'bouncer', location: 'Nightclub', voiceType: 'male' },
      { id: 'npc_7', name: 'Emma', role: 'receptionist', location: 'Hotel', voiceType: 'female' },
      { id: 'npc_8', name: 'David', role: 'police_officer', location: 'Police Station', voiceType: 'male' }
    ];

    npcData.forEach(npc => {
      this.npcs.set(npc.id, {
        ...npc,
        health: 100,
        state: 'idle',
        conversation: null,
        memory: []
      });
    });
  }

  addPlayer(playerId, playerData) {
    this.players.set(playerId, {
      ...playerData,
      health: 100,
      money: 5000,
      level: 1,
      location: 'Downtown',
      inventory: [],
      relationships: {},
      createdAt: Date.now()
    });
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  updatePlayer(playerId, updates) {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player, updates);
      return player;
    }
  }

  getNPC(npcId) {
    return this.npcs.get(npcId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getNPCs() {
    return Array.from(this.npcs.values());
  }
}

const gameState = new GameStateManager();

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`🎮 Player connected: ${socket.id}`);

  // Player Join
  socket.on('player:join', (playerData) => {
    gameState.addPlayer(socket.id, playerData);
    io.emit('players:update', gameState.getPlayers());
    socket.emit('game:initialized', {
      player: gameState.getPlayer(socket.id),
      npcs: gameState.getNPCs(),
      players: gameState.getPlayers()
    });
  });

  // Player Movement
  socket.on('player:move', (position) => {
    const player = gameState.updatePlayer(socket.id, { position });
    if (player) {
      io.emit('player:position', { playerId: socket.id, position });
    }
  });

  // Voice Channel
  socket.on('voice:start', (data) => {
    const { targetId, type } = data; // type: 'player' or 'npc'
    gameState.voiceChannels.set(socket.id, {
      target: targetId,
      type: type,
      startTime: Date.now(),
      messages: []
    });
    io.emit('voice:started', { from: socket.id, to: targetId });
  });

  // Voice Data Streaming
  socket.on('voice:data', (audioData) => {
    const channel = gameState.voiceChannels.get(socket.id);
    if (channel) {
      channel.messages.push(audioData);
      io.emit('voice:stream', { from: socket.id, data: audioData });
    }
  });

  // Chat Message
  socket.on('chat:send', (message) => {
    const player = gameState.getPlayer(socket.id);
    io.emit('chat:message', {
      playerId: socket.id,
      playerName: player?.name || 'Unknown',
      message: message,
      timestamp: Date.now()
    });
  });

  // NPC Interaction
  socket.on('npc:interact', (npcId) => {
    const npc = gameState.getNPC(npcId);
    if (npc) {
      npc.conversation = socket.id;
      socket.emit('npc:interaction', {
        npcId: npcId,
        npc: npc,
        greeting: `Hey there! I'm ${npc.name}, a ${npc.role}.`
      });
    }
  });

  // Mission Accept
  socket.on('mission:accept', (missionId) => {
    const player = gameState.getPlayer(socket.id);
    if (player) {
      const missions = [
        { id: 'delivery_1', title: 'Pizza Delivery', reward: 500 },
        { id: 'escort_1', title: 'Escort VIP', reward: 1000 },
        { id: 'race_1', title: 'Street Race', reward: 1500 }
      ];
      const mission = missions.find(m => m.id === missionId);
      if (mission) {
        socket.emit('mission:accepted', mission);
        io.emit('mission:notification', { playerId: socket.id, mission });
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    io.emit('players:update', gameState.getPlayers());
    console.log(`❌ Player disconnected: ${socket.id}`);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

app.get('/api/game/state', (req, res) => {
  res.json({
    players: gameState.getPlayers(),
    npcs: gameState.getNPCs(),
    timestamp: Date.now()
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
🚀 GameForge Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🎮 WebSocket ready for connections\n`);
});

module.exports = { app, io, gameState };
