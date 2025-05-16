import type { CHRVariable } from '@chr-ide/core';

/**
 * File format supported by this version of CHR IDE.
 */
const WORKSPACE_FILE_FORMAT_VERSION = 0;

export const useChrStore = defineStore('chr', {
    state: () => ({
        /**
         * CHR code
         */
        code: '',

        /**
         * Watched variables.
         */
        variables: [] as CHRVariable[],

        /**
         * Triggered constraints.
         */
        constraints: [] as string[],

        /**
         * The current connection, if available.
         */
        socket: null as CHRSocket | null,

        /**
         * Whether a program is currently running on the backend.
         */
        running: false,

        /**
         * Whether the socket is currently offline.
         */
        disconnected: true,
    }),
    actions: {
        /**
         * Get a serializable representation of this store.
         * @returns An object that is meant to be serialized to disk.
         */
        getSaveFormat() {
            return {
                code: this.code,
                variables: this.variables,
                constraints: this.constraints,
                formatVersion: WORKSPACE_FILE_FORMAT_VERSION,
            };
        },

        /**
         * Setup a socket for use with this store.
         * @param socket The socket to use.
         */
        setupSocket(socket: CHRSocket) {
            this.socket = socket;

            this.disconnected = socket.disconnected;
            
            socket.on('connect', () => this.disconnected = false);
            socket.on('disconnect', () => this.disconnected = true);
            
            socket.on('error', () => this.running = false);
            socket.on('finished', () => this.running = false);

            // TODO: listen to parser events
        },

        /**
         * Reset the store while keeping the connection intact.
         */
        reset() {
            const socket = this.socket;
            this.$reset();
            this.socket = socket;
        },

        /**
         * Run the current program on the backend.
         */
        run() {
            this.running = true;
            this.socket?.emit('pushJob', '', []); // TODO: finish this
        }
    }
});