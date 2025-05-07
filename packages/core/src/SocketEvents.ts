type ErrorStep = 'chrpp' | 'cpp';

export type ServerToClientEvents = {
    transpiling: () => void;
    compiling: () => void;
    running: () => void;
    finished: (output: string, exitCode: number) => void;
    error: (step: ErrorStep) => void;
};

export type ClientToServerEvents = {
    pushJob: (code: string) => void;
};

export type InterServerEvents = {};

export type SocketData = {};