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
            .replace(', ',',')
            .replace(/ +/g, ' ') // Fuse multiple spaces into one
            .split('\n') // Split the output line by line
            .filter(l => l.trim() !== '') // Remove empty lines
            .map(l => l.split(' ')[1]) // Keep only the second part (from 'TRACE [SOMETHING][A][B] explanation' keep only '[SOMETHING][A][B]')
            .map(l => l.substring(1, l.length - 1) // Remove the first and last character, to facilitate splitting the string later
            .split('][')); // Split the tokens
        
        batches.forEach(tokens => {
            verbose(`${socket.handshake.address}: ${tokens.join(' | ')}`);
            const [type, ...rest] = tokens;
            const message = rest.join(' ');
            console.log(`TRACE PARSER: ${type} ${message}`);
            
            switch (type) {

                case 'GOAL':
                    socket.emit('parsing_goal', message);
                    break;
                case 'CALL':
                    socket.emit('parsing_call', message);
                    break;
                case 'TRY':
                    socket.emit('parsing_try', message);
                    break;
                case 'EXIT':
                    socket.emit('parsing_exit', message);
                    break;
                case 'INSERT':
                    socket.emit('parsing_insert', message);
                    break;
                case 'PARTNER':
                    socket.emit('parsing_partner', message);
                    break;
                case 'COMMIT':
                    socket.emit('parsing_commit', message);
                    break;
                case 'FAIL':
                    socket.emit('parsing_fail', message);
                    break;
                case 'WAKE':
                    socket.emit('parsing_wake', message);
                    break;
                case 'REMOVE':
                    socket.emit('parsing_remove', message);
                    break;
                case 'BACKTRACK':
                    socket.emit('parsing_backtrack', message);
                    break;
                case 'HISTORY':
                    socket.emit('parsing_history', message);
                    break;
                case 'PROGRAM':
                    socket.emit('parsing_prog', message);
                    break;
                case 'VAR':
                    socket.emit('parsing_var', message);
                    break;
                default:
                    console.error(`TRACE PARSER: Unknown token '${type}', skipping`);
                    socket.emit('error', 'parser', type);
                    break;
            }

        });
    }
};