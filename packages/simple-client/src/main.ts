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


socket.on('connect', () => {
	socket.emit('pushJob', `

		<chr_constraint> acker(?int,?int,?int)
		
		acker(X, Y, A1) \\ acker(X, Y, A2) <=> A1 %= A2;;
		acker(0, Y, A) ==>  A %= Y + 1;;
		acker(X, 0, A) ==> acker(X - 1, 1, A);;
		acker(X, Y, A) ==> X > 0 and Y > 0 | 
							acker(X, Y - 1, A1),
							acker(X - 1, A1, A);;


		`, ["acker(2,3, 5)"], [{constraint: "acker", position: 1, value : "5"} as CHRVariable] );
});