import express from 'express';
import { createServer } from 'node:http';
import { exit } from 'node:process';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@chr-ide/core';
import { Server } from 'socket.io';
import Config from './config.js';
import { setup } from './socket.js';
import { checkForChrppc, checkForCompiler } from './process.js';

console.log('Starting chr-ide');

// Check if chrppc and a C++ compiler are available
const [chrppc, cpp] = await Promise.all([
    checkForChrppc(),
    checkForCompiler(),
]);

if(!chrppc || !cpp) {
    console.error('\nThe following required components are missing:');

    if(!chrppc) {
        console.error('\t- chrppc');
    }

    if(!cpp) {
        console.error('\t- C++ compiler');
    }

    console.error('\nSee the documentation to learn how to configure CHR IDE: https://github.com/ttcchhmm/chr-ide/blob/main/packages/backend/README.md#configuration');

    exit(1);
}

// Setup the Socket.io server
const app = express();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000
    },

    cors: {
        origin: Config.allowedOrigins.split(','),
    },
});

// Serve the frontend
app.use(express.static('./web'));

setup(io);

server.listen(Config.port, () => console.log(`Server running on ${Config.port}`));