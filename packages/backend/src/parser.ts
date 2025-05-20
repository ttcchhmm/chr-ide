import type { CHRSocket } from "./socket.js"
import verbose from "./utils/verbose.js";
import { CHRVariable } from "@chr-ide/core";
/**
 * Parse the trace of a CHR program, and send the events to the client.
 * 
 * @param socket - The socket to send the events to.
 * @returns A function that can get input from a CHR program and parse it.
 */
export default (socket: CHRSocket) => (input: string) => {
    if(input.startsWith('TRACE [')) {

        const batches = input
            .replace(', ',',')
            .replace(/ +/g, ' ') // Fuse multiple spaces into one
            .split('\n') // Split the output line by line
            .filter(l => l.trim() !== '') // Remove empty lines
            .map(l => l.split(' ')[1]) // Keep only the second part (from 'TRACE [SOMETHING][A][B] explanation' keep only '[SOMETHING][A][B]')
            .filter(l => l !== undefined)
            .map(l => l.substring(1, l.length - 1) // Remove the first and last character, to facilitate splitting the string later
            .split('][')); // Split the tokens

        batches.forEach(tokens => {
            verbose(`${socket.handshake.address}: ${tokens.join(' | ')}`);
            const [type, ...rest] = tokens;
            const message = rest.join(' ');
            console.log(`TRACE PARSER: ${type} ${message}`);
            
            switch (type) {
                case 'FAIL':
                    socket.emit('parsing_fail', message);
                    break;
                case 'RULES': {
                    // format : acker#22(0,7,8)
                    const cleaned = message.replace(/#.*?\(/, '(');
                    socket.emit('parsing_rules', cleaned);
                    break;
                }
                case 'VAR': {
                    // format : acker/1 2
                    const [constraint, position, value] = message.replace("/", " ").split(' ');
                    const chrVariable: CHRVariable = {
                        constraint: constraint.trim(),
                        position: parseInt(position),
                        value: value
                    };
                    socket.emit('parsing_var', chrVariable);
                    break;
                }

                default: {
                    console.error(`TRACE PARSER: Unknown token '${type}', skipping`);
                    socket.emit('error', 'parser', type);
                    break;
                }

                case 'GOAL':
                case 'CALL':
                case 'TRY':
                case 'EXIT':
                case 'INSERT':
                case 'PARTNER':
                case 'COMMIT':
                case 'WAKE':
                case 'REMOVE':
                case 'BACKTRACK':
                case 'HISTORY': {
                    break;
                }
            }
        });
    }
};