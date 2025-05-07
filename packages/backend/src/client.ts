import { io, type Socket } from 'socket.io-client';
import { readFileSync } from 'node:fs';
import { exit } from 'node:process';
import type { ServerToClientEvents, ClientToServerEvents } from '@chr-ide/core/src/SocketEvents';

const code = readFileSync('./example/sudoku.chrpp', { encoding: 'utf-8' });

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');

socket.on('error', (step) => {
    console.error(`Compilation failed at step ${step}`);
    exit(1);
});

socket.on('running', () => console.log('Program started on server'));
socket.on('transpiling', () => console.log('chrppc started running'));
socket.on('compiling', () => console.log('C++ compiler started running'));

socket.on('finished', (output, exitCode) => {
    console.log(`Program exited with code ${exitCode}`);
    console.log(output);
    exit(0);
});

socket.on('connect', () => socket.emit('pushJob', code));