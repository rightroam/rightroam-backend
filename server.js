const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// ── Routes ──
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/lawyers', require('./routes/lawyers'));
app.use('/api/cases',   require('./routes/cases'));
app.use('/api/payment', require('./routes/payment'));

// ── Socket.io — Chat temps réel ──
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  socket.on('join_room', ({ roomId, userId }) => {
    socket.join(roomId);
    activeUsers[userId] = socket.id;
    io.to(roomId).emit('user_joined', { userId });
  });

  socket.on('send_message', ({ roomId, message, senderId, senderName }) => {
    const msg = {
      id: Date.now().toString(),
      roomId,
      message,
      senderId,
      senderName,
      timestamp: new Date().toISOString(),
    };
    io.to(roomId).emit('receive_message', msg);
  });

  socket.on('lawyer_location', ({ roomId, latitude, longitude }) => {
    io.to(roomId).emit('lawyer_moving', { latitude, longitude });
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(activeUsers).find(k => activeUsers[k] === socket.id);
    if (userId) delete activeUsers[userId];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`RightRoam backend démarré sur le port ${PORT}`));

module.exports = { app, io };
