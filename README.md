# GameForge Server

🎮 **Production-grade multiplayer game server with WebRTC voice, AI dialogue, and real-time multiplayer gameplay.**

## Features

✅ **Real-time Multiplayer** - Socket.io for instant game state sync
✅ **WebRTC Voice** - Direct peer-to-peer voice communication
✅ **AI NPCs** - 8+ NPCs with realistic personalities
✅ **Voice Conversations** - Talk to anyone with your microphone
✅ **Mission System** - Dynamic missions with rewards
✅ **Job System** - Work as taxi driver, chef, bouncer, etc.
✅ **Economy** - Earn money, buy properties, manage businesses
✅ **Relationship System** - Build relationships with NPCs
✅ **Location System** - Downtown, Beach, Airport, Casino, Suburbs

## Tech Stack

- **Backend**: Node.js + Express
- **Real-time**: Socket.io + WebRTC
- **Database**: MongoDB
- **Voice**: Web Speech API + TTS/STT
- **Authentication**: JWT
- **AI**: OpenAI Integration (optional)

## Installation

```bash
# Clone repository
git clone https://github.com/HUMANITY-creator/GameForge-Server.git
cd GameForge-Server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start server
npm start
# Or development mode
npm run dev
```

## API Endpoints

### Players
- `POST /api/players/create` - Create new player
- `GET /api/players/:playerId` - Get player stats

### NPCs
- `GET /api/npcs` - Get all NPCs
- `GET /api/npcs/:npcId` - Get NPC details
- `POST /api/npcs/:npcId/chat` - Chat with NPC

### Voice
- `POST /api/voice/stream` - Stream voice data
- `POST /api/voice/tts` - Text-to-speech
- `POST /api/voice/stt` - Speech-to-text

### Game
- `GET /api/game/missions` - Get available missions
- `POST /api/game/missions/:missionId/accept` - Accept mission
- `GET /api/game/jobs` - Get available jobs
- `POST /api/game/jobs/:jobId/start` - Start job
- `GET /api/game/locations` - Get game locations

## WebSocket Events

### Client → Server
- `player:join` - Join game
- `player:move` - Update position
- `voice:start` - Start voice call
- `voice:data` - Stream voice data
- `chat:send` - Send message
- `npc:interact` - Interact with NPC
- `mission:accept` - Accept mission

### Server → Client
- `game:initialized` - Game loaded
- `players:update` - Player list updated
- `player:position` - Player moved
- `voice:started` - Voice call started
- `voice:stream` - Voice data received
- `chat:message` - Chat message
- `npc:interaction` - NPC interaction
- `mission:notification` - Mission notification

## Configuration

Edit `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gameforge
JWT_SECRET=your_secret_key
MAX_PLAYERS=100
GAME_TICK_RATE=60
```

## Development

```bash
# Install dev dependencies
npm install --save-dev nodemon jest

# Run with auto-reload
npm run dev

# Run tests
npm test
```

## Deployment

### Heroku
```bash
heroku create gameforge-server
git push heroku main
```

### AWS/DigitalOcean
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "gameforge"
pm2 save
```

## Performance

- **Max Players**: 100+
- **Max NPCs**: 50+
- **Update Frequency**: 60 ticks/second
- **Memory Usage**: ~500MB base + per-player

## Security

- ✅ JWT Authentication
- ✅ CORS Protection
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Encrypted Voice Data

## Contributing

Contributions welcome! Please submit PRs to the main repository.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, open a GitHub issue.

---

**🚀 GameForge - Where Everyone Has a Voice**
