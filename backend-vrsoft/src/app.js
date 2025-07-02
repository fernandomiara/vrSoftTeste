const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const notifyRoutes = require('./routes/notify.routes');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');
const statusService = require('./service/status.service');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', notifyRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// Integra o Socket.IO no statusService
statusService.setSocketIO(io);
module.exports = app;