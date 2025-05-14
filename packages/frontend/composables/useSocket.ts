import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@chr-ide/core";

export type CHRSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Get a new Socket.io connection to the backend.
 * @returns A Socket.io object that should connect to the backend.
 */
export const useSocket = () => {
    const socket: CHRSocket = io(useRuntimeConfig().public.host);

    socket.on('disconnect', (reason, description) => console.error(`Disconnected: ${reason}, ${description}`));
    socket.on('connect_error', (e) => console.error(`Connection error: ${e}`));

    return socket;
}