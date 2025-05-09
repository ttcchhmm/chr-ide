import express from 'express';
import { createServer } from 'node:http';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@chr-ide/core';
import { Server } from 'socket.io';
import Config from './config.js';
import { setup } from './socket.js';

console.log('Starting chr-ide');

// Setup the Socket.io server
const app = express();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

// Serve the frontend
app.use(express.static('./web'));

setup(io);

server.listen(Config.wsPort, () => console.log(`Server running on ${Config.wsPort}`));