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
#include <iostream>
#include <string>
#include <chrpp.hh>

/*
<CHR name="Test">
    <chr_constraint>    cat(?std::string), person(?std::string),
                        dog(?std::string), sleepy(?std::string),
                        lazy(?std::string)
    cat("bounty")   <=> success();;
    cat(_)          <=> failure();;
 
    person("jack")  <=> success();;
    person(_)       <=> failure();;
 
    dog("ginger")   <=> success();;
    dog(_)          <=> failure();;
 
    sleepy("jack")  <=> success();;
    sleepy("bounty")<=> success();;
    sleepy(_)       <=> failure();;
 
    lazy(X) <=> cat(X) ; sleepy(X);;
</CHR>
 */

int main() {
    auto space = Test::create();
    if (space->lazy(std::string("bounty"))) 
        std::cout << "true" << std::endl;
    else
        std::cout << "false" << std::endl;
 
    if (space->lazy(std::string("jack"))) 
        std::cout << "true" << std::endl;
    else
        std::cout << "false" << std::endl;
 
    if (space->lazy(std::string("ginger"))) 
        std::cout << "true" << std::endl;
    else
        std::cout << "false" << std::endl;
    return 0;
}
        `);
});