import type { CHRSocket } from "./socket.js"
import verbose from "./utils/verbose.js";
import { CHRVariable } from "@chr-ide/core";

/**
 * A logical variable.
 */
type LogicalVariable = {
    /**
     * Name of the constraint.
     */
    constraint: string;

    /**
     * Position of the variable within the constraint.
     */
    position: number;

    /**
     * Name of the variable.
     */
    variable: string;
};

/**
 * A logical variable with typing information.
 */
type TypedLogicalVariable = {
    /**
     * The type associated with this variable.
     */
    type: string | null;
} & LogicalVariable;

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

/**
 * Check if a variable is uppercase.
 * 
 * @param constraints - An array of constraints to check.
 * @returns An array of objects containing the constraint name, position, and variable name.
 */
export const findUppercaseVariables = (constraints: string[]) => {
    const results = [] as LogicalVariable[];

    constraints.forEach(constraint => {
        const regex = /(\w+)\(([^)]+)\)/; 
        const match = regex.exec(constraint);

        if (match) {
            const constraintName = match[1];
            const args = match[2].split(','); 

            args.forEach((arg, index) => {
                const trimmedArg = arg.trim();
                if (trimmedArg.match(/^[A-Z][A-Za-z]*$/)) { 
                    results.push({ constraint: constraintName, position: index + 1, variable: trimmedArg }); 
                }
            });
        }
    });

    return results;
};

/**
 * Find the types of variables in the code.
 * 
 * @param code - The code to analyze.
 * @param variables - An array of objects containing the constraint name, position, and variable name.
 * @returns An array of objects containing the constraint name, position, type, and variable name.
 */
export const findVariableTypes = (code: string, variables: LogicalVariable[]) => {
    const results = [] as TypedLogicalVariable[];

    // Extract contraint declaration
    const constraintDeclarations = code.match(/<chr_constraint>[^;]+;/g);
    if (!constraintDeclarations) {
        // Return null if no variables are found
        variables.forEach(variable => {
            results.push({ ...variable, type: null });
        });
        return results;
    }

    // Associates variables with their type
    variables.forEach(({ constraint, position, variable }) => {
        let type: string | null = null;

        // Match declarations with their constraint
        constraintDeclarations.forEach(declaration => {
            const regex = new RegExp(`${constraint}\\(([^)]+)\\)`); // Find the proper constraint
            const match = regex.exec(declaration);

            if (match) {
                const params = match[1].split(',').map(param => param.trim());
                if (position - 1 < params.length) {
                    type = params[position - 1].replace(/[+?]/g, '').trim(); // Remove modifiers to get the type
                }
            }
        });

        results.push({ constraint, position, type, variable });
    });

    return results;
};