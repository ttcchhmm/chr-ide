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
            .map(l => {
                const parts = l.split(' ');
                const explanation = parts.slice(2).join(' '); // Extract the explanation
                return { tokens: parts[1].substring(1, parts[1].length - 1).split(']['), explanation };
            });

        batches.forEach(({ tokens, explanation }) => {
            verbose(`${socket.handshake.address}: ${tokens.join(' | ')} | ${explanation}`);
            const [type, ...rest] = tokens;
            const message = rest.join(' ');
            console.log(`TRACE PARSER: ${type} ${message} | Explanation: ${explanation}`);
            
            switch (type) {
                case 'FAIL':
                    socket.emit('parsing_fail', message + " : " +  explanation);
                    break;
                case 'RULES': {
                    // format : acker#22(0,7,8)
                    const cleaned = message.replace(/#.*?\(/, '(');
                    socket.emit('parsing_rules', cleaned );
                    break;
                }
                case 'VAR': {
                    // format : res
                    console.log(`TRACE PARSER: VAR ${message} | Explanation: ${explanation}`);
                    const [var_name, value] = message.replace("/", " ").split(' ');
                    const chrVariable: CHRVariable = {
                        name: var_name,
                        value: value
                    };
                    console.log(chrVariable)
                    socket.emit('parsing_var', chrVariable);
                    break;
                }

                case 'BACKTRACK':
                    socket.emit('parsing_backtrack', explanation);
                    break;


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
                case 'HISTORY': {
                    break;
                }
            }
        });
    }
};