// Simple program that send a CHR program to a CHR-IDE server.

import { io, type Socket } from "socket.io-client";
import { exit } from 'node:process';
import type { ServerToClientEvents, ClientToServerEvents } from "@chr-ide/core";
import { CHRVariable } from "@chr-ide/core";

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

socket.on('parsing_fail', (fail) => console.log(`Fail: ${fail}`));
socket.on('parsing_rules', (history) => console.log(`Prog: ${history}`));
socket.on('parsing_var', (variable: CHRVariable) => {
	console.log(`Var: ${JSON.stringify(variable)}`);
});
socket.on('parsing_backtrack', (backtrack) => console.log(`Backtrack: ${backtrack}`));

