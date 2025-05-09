import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@chr-ide/core";
import { DisconnectReason, type Server, type Socket } from "socket.io";
import { chrppc, cpp, program, setupCompilation } from "./process.js";
import parser from "./parser.js";

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
    async (code: string) => {
        console.log(`Received code from ${socket.handshake.address}`);

        const directory = await setupCompilation(code);

        socket.emit('transpiling');
        if(await chrppc(directory)) {
            socket.emit('compiling');

            if(await cpp(directory)) {
                socket.emit('running');
                
                if(await program(directory, parser(socket))) {
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

        // Listen for events from the client
        socket.on('disconnect', onDisconnect(socket));
        socket.on('pushJob', onPushJob(socket));
    });
};