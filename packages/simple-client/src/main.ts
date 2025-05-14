// Simple program that send a CHR program to a CHR-IDE server.

import { io, type Socket } from "socket.io-client";
import { exit } from 'node:process';
import type { ServerToClientEvents, ClientToServerEvents } from "@chr-ide/core";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');

socket.on('error', (step) => {
    console.error(`Compilation failed at step ${step}`);
    exit(1);
});

socket.on('running', () => console.log('Program started on server'));
socket.on('transpiling', () => console.log('chrppc started running'));
socket.on('compiling', () => console.log('C++ compiler started running'));

socket.on('finished', () => {
    console.log('Program exited');
    exit(0);
});

socket.on('connect', () => {
    socket.emit('pushJob', `

        <chr_constraint> syracuse(?unsigned long int, ?unsigned long int)
        stop @ syracuse(1LU, C) <=> C %= 0;;
        even_case @ syracuse(R,C) <=> R % 2 == 0 | syracuse(R / 2,C1), C %= C1 + 1;;
        odd_case @ syracuse(R,C) <=> R % 2 == 1 | syracuse(3 * R + 1,C1), C %= C1 + 1;;

        `);
});