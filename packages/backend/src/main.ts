import { createServer } from 'node:http';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@chr-ide/core';
import { Server } from 'socket.io';
import Config from './config.js';
import { setup } from './socket.js';

console.log('Starting chr-ide');

// Setup the Socket.io server
const server = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);
setup(io);

server.listen(Config.wsPort, () => console.log(`Server running on ${Config.wsPort}`));