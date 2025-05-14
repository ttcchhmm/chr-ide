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

socket.on('parsing_goal', (goal) => console.log(`Goal: ${goal}`));
socket.on('parsing_call', (call) => console.log(`Call: ${call}`));
socket.on('parsing_try', (try_) => console.log(`Try: ${try_}`));
socket.on('parsing_exit', (exit) => console.log(`Exit: ${exit}`));
socket.on('parsing_insert', (insert) => console.log(`Insert: ${insert}`));
socket.on('parsing_partner', (partner) => console.log(`Partner: ${partner}`));
socket.on('parsing_commit', (commit) => console.log(`Commit: ${commit}`));
socket.on('parsing_fail', (fail) => console.log(`Fail: ${fail}`));
socket.on('parsing_wake', (wake) => console.log(`Wake: ${wake}`));
socket.on('parsing_remove', (remove) => console.log(`Remove: ${remove}`));
socket.on('parsing_backtrack', (backtrack) => console.log(`Backtrack: ${backtrack}`));
socket.on('parsing_history', (history) => console.log(`History: ${history}`));



socket.on('connect', () => {
    socket.emit('pushJob', `

        <chr_constraint> syracuse(?unsigned long int, ?unsigned long int)
        stop @ syracuse(1LU, C) <=> C %= 0;;
        even_case @ syracuse(R,C) <=> R % 2 == 0 | syracuse(R / 2,C1), C %= C1 + 1;;
        odd_case @ syracuse(R,C) <=> R % 2 == 1 | syracuse(3 * R + 1,C1), C %= C1 + 1;;

        `);
});