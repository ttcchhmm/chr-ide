import { CHRVariable } from "CHRVariable.js";

/**
 * Possible error steps during the compilation process.
 */
type ErrorStep = 'chrpp' | 'cpp' | 'program' | 'parser';

/**
 * Events emitted from the server to the client.
 */
export type ServerToClientEvents = {
    /**
     * Emitted when chrppc is being run.
     */
    transpiling: () => void;

    /**
     * Emitted when the C++ compiler is being run.
     */
    compiling: () => void;

    /**
     * Emitted when the program is being run.
     */
    running: () => void;

    /**
     * Emitted when the program finished.
     */
    finished: () => void;

    /**
     * Emitted when the compilation process fails.
     * 
     * @param step - The step where the error occurred
     * @param message - An optional error message
     */
    error: (step: ErrorStep, message?: string) => void;

    /**
     * Emitted when the program fails.
     * 
     * @param error_message - The error message.
     */
    parsing_fail: (error_message: string) => void;

    /**
     * Emitted when the program finds a rules.
     * 
     * @param constraint - The constraint that was found.
     */
    parsing_rules: (constraint: string) => void;

    /**
     * Emitted when the program finds a watched variable.
     * 
     * @param variable - The variable that was found.
     */
    parsing_var: (variable: CHRVariable) => void;


    /**
     * Emitted when the program backtracks.
     * 
     * @param explanation - The explanation of the backtrack.
     */
    parsing_backtrack: (explanation: string) => void;

};

/**
 * Events emitted from the client to the server.
 */
export type ClientToServerEvents = {
    /**
     * Emitted when the user wants to run the program.
     * 
     * @param code The code to run.
     * @param constraints The constraints that should be pre-triggered.
     */
    pushJob: (code: string, constraints: string[], watch : CHRVariable[]) => void;
};

export type InterServerEvents = object;

export type SocketData = object;