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
socket.on('parsing_rules', (history) => console.log(`Prog: ${history}`));
socket.on('parsing_var', (history) => console.log(`Var: ${history}`));


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