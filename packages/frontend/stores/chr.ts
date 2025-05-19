import type { CHRVariable } from '@chr-ide/core';

export const useChrStore = defineStore('chr', {
    state: () => ({
        /**
         * CHR code
         */
        code: '',

        /**
         * Variables history.
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
            
            socket.on('error', (step) => {
                this.running = false;
                useToast().add({
                    title: 'Run failed',
                    description: `The run failed at the following step: ${step}.`,
                    color: 'error',
                });
            });

            socket.on('finished', () => this.running = false);

            socket.on('parsing_var', (v) => {

                const variable = this.variables.find(localVar => localVar.constraint === v.constraint && localVar.position === v.position);

                if(!variable) {
                    this.variables.push(v);
                }
            });

            socket.on('parsing_rules', (c) => this.constraints.push(c));

            socket.on('parsing_fail', (msg) => {
                this.running = false;
                useToast().add({
                    title: 'Program failed',
                    description: `The program failed with the following error: ${msg}.`,
                    color: 'error',
                });
            });

            socket.on('running', () => this.$patch({
                constraints: [],
                variables: [],
            }));
        },

        /**
         * Reset the store while keeping the connection intact.
         */
        reset() {
            const socket = this.socket;
            const disconnected = this.disconnected;
            this.$reset();
            this.socket = socket;
            this.disconnected = disconnected;
        },

        /**
         * Run the current program on the backend.
         */
        run() {
            this.running = true;
            this.socket?.emit('pushJob', this.code, this.constraints, this.variables);
        }
    }
});