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

    parsing_goal: (message?: string) => void;
    parsing_exit: (message?: string) => void;
    parsing_fail: (message?: string) => void;
    parsing_partner: (message?: string) => void;
    parsing_wake: (message?: string) => void;
    parsing_insert: (message?: string) => void;
    parsing_call: (message?: string) => void;
    parsing_remove: (message?: string) => void;
    parsing_try: (message?: string) => void;
    parsing_commit: (message?: string) => void;
    parsing_backtrack: (message?: string) => void;
    parsing_history: (message?: string) => void;
    parsing_all: (message?: string) => void;
};

/**
 * Events emitted from the client to the server.
 */
export type ClientToServerEvents = {
    /**
     * Emitted when the user wants to run the program.
     * 
     * @param code The code to run.
     */
    pushJob: (code: string) => void;
};

export type InterServerEvents = object;

export type SocketData = object;