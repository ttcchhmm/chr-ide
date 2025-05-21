import type { CHRVariable } from '@chr-ide/core';

/**
 * An entry in the log.
 */
type LogEntry = {
    /**
     * The date when the log entry was created.
     */
    date: Date,

    /**
     * The content of the log.
     */
    content: string,
};

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

        /**
         * Log entries.
         */
        logs: [] as LogEntry[],
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
                logs: this.logs,
            };
        },

        /**
         * Setup a socket for use with this store.
         * @param socket The socket to use.
         */
        setupSocket(socket: CHRSocket) {
            this.socket = socket;

            this.disconnected = socket.disconnected;
            
            socket.on('connect', () => {
                this.disconnected = false;
                this.log('Connected.');
            });

            socket.on('disconnect', () => {
                this.disconnected = true;
                this.log('Disconnected.')
            });
            
            socket.on('error', (step, message) => {
                this.running = false;

                let description = `The run failed at the following step: ${step}.`;
                if(message) {
                    description += `\n\n${message}`;
                }

                useToast().add({
                    title: 'Run failed',
                    description,
                    color: 'error',
                });

                this.log(`Run failed: ${step}.`);
            });

            socket.on('finished', () => {
                this.running = false;
                this.log('Finished.');
            });

            socket.on('parsing_var', (v) => {
                const variable = this.variables.find(localVar => localVar.constraint === v.constraint && localVar.position === v.position);

                if(!variable) {
                    this.variables.push(v);
                    this.log(`Got variable: ${v.constraint}/${v.position} = ${v.value}.`);
                }
            });

            socket.on('parsing_rules', (c) => {
                this.constraints.push(c);
                this.log(`Got constraint: ${c}`);
            });

            socket.on('parsing_backtrack', (msg) => this.log(`Backtracking: ${msg}`));

            socket.on('parsing_fail', (msg) => this.log(`Got failure: ${msg}`));

            socket.on('running', () => {
                this.$patch({
                    constraints: [],
                    variables: [],
                });

                this.log('Program started.');
            });

            socket.on('transpiling', () => this.log('Running chrppc...'));

            socket.on('compiling', () => this.log('Compiling C++ code...'));
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
        },

        /**
         * Log something.
         * @param content The content to add to the log.
         */
        log(content: string) {
            this.logs.push({
                date: new Date(),
                content,
            });

            console.log(content);
        },
    }
});