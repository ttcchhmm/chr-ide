import type { CHRSocket } from "./socket.js"
import verbose from "./utils/verbose.js";

/**
 * Parse the trace of a CHR program, and send the events to the client.
 * 
 * @param socket - The socket to send the events to.
 * @returns A function that can get input from a CHR program and parse it.
 */
export default (socket: CHRSocket) => (input: string) => {
    if(input.startsWith('TRACE [')) {
        const batches = input
            .replace(/ +/g, ' ') // Fuse multiple spaces into one
            .split('\n') // Split the output line by line
            .filter(l => l.trim() !== '') // Remove empty lines
            .map(l => l.split(' ')[1]) // Keep only the second part (from 'TRACE [SOMETHING][A][B] explanation' keep only '[SOMETHING][A][B]')
            .map(l => l.substring(1, l.length - 1) // Remove the first and last character, to facilitate splitting the string later
            .split('][')); // Split the tokens
        
        batches.forEach(tokens => {
            verbose(`${socket.handshake.address}: ${tokens.join(' | ')}`);

            switch(tokens[0]) {
                case 'GOAL': {
                    // TODO: finish the parser
                    break;
                }

                case 'CALL': {
                    // TODO: finish the parser
                    break;
                }

                case 'TRY': {
                    // TODO: finish the parser
                    break;
                }

                case 'EXIT': {
                    // TODO: finish the parser
                    break;
                }

                case 'INSERT': {
                    // TODO: finish the parser
                    break;
                }

                case 'PARTNER': {
                    // TODO: finish the parser
                    break;
                }

                case 'COMMIT': {
                    // TODO: finish the parser
                    break;
                }

                case 'FAIL': {
                    // TODO: finish the parser
                    break;
                }

                case 'WAKE': {
                    // TODO: finish the parser
                    break;
                }

                case 'REMOVE': {
                    // TODO: finish the parser
                    break;
                }

                case 'BACKTRACK': {
                    // TODO: finish the parser
                    break;
                }

                case 'HISTORY': {
                    // TODO: finish the parser
                    break;
                }

                default: {
                    console.error(`TRACE PARSER: Unknown token '${tokens[0]}', skipping`);
                    socket.emit('error', 'parser', tokens[0]);
                    break;
                }
            }
        });
    }
};