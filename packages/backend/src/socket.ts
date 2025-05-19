import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@chr-ide/core";
import { DisconnectReason, type Server, type Socket } from "socket.io";
import { chrppc, cpp, prepareFile , program, setupCompilation } from "./process.js";
import parser from "./parser.js";
import { CHRVariable } from "@chr-ide/core";
import Config from "./config.js";
import { rm } from 'node:fs/promises';
import verbose from "./utils/verbose.js";

/**
 * Socket type for the CHR IDE server.
*/
export type CHRSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Function to handle the `pushJob` event.
 * 
 * @param socket - The socket that emitted the event.
 * @param code - The code to compile and run.
 */
const onPushJob = (socket: CHRSocket) =>
    async (code: string, constraints: string[], watch: CHRVariable[]) => {
        console.log(`Received code from ${socket.handshake.address}`);
        const chrppCode = await prepareFile(code, constraints, watch);
        const directory = await setupCompilation(chrppCode);

        socket.emit('transpiling');
        if (await chrppc(directory)) {
            socket.emit('compiling');

            if (await cpp(directory)) {
                socket.emit('running');

                if (await program(directory, parser(socket))) {
                    socket.emit('finished');
                } else {
                    socket.emit('error', 'program');
                }
            } else {
                socket.emit('error', 'cpp');
            }
        } else {
            socket.emit('error', 'chrpp');
        }

        if(!Config.keepData) {
            await rm(directory, { recursive: true, force: true });
        } else {
            verbose(`Keeping ${directory}`);
        }
    };

/**
 * Function to handle the `disconnect` event.
 * 
 * @param socket - The socket that emitted the event.
 * @returns A function that handles the disconnection event.
 */
const onDisconnect = (socket: CHRSocket) =>
    (reason: DisconnectReason) => console.log(`Client ${socket.handshake.address} disconnected: ${reason}`);

/**
 * Setup the Socket.io server.
 * 
 * @param io - The Socket.io server instance.
 */
export const setup = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    io.on('connect', (socket) => {
        console.log(`New connection from ${socket.handshake.address}`);

        socket.on('disconnect', onDisconnect(socket));
        socket.on('pushJob', (code: string, constraints: string[], watch : CHRVariable[]) => {
           void onPushJob(socket)(code, constraints, watch);
        });
    });
};