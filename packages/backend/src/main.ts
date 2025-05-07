import { ChildProcess, spawn } from 'node:child_process';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@chr-ide/core/src/SocketEvents';
import type Stream from 'node:stream';

type CommandLineOutputCallback = (output: string) => void;

async function waitForProcessEnd(process: ChildProcess) {
    return new Promise<number>((resolve) => {
        process.on('close', (code) => resolve(code ?? -1));
    });
}

async function waitForClosedInput(input: Stream.Readable) {
    return new Promise<void>((resolve) => {
        input.on('close', () => {
            resolve();
        });
    });
}

async function runChrpp(compilePath: string) {
    const chrppc = spawn(
        '/Users/tom/.bin/chrppc/usr/local/bin/chrppc',
        [
            './main.chrpp',
        ],
        { cwd: compilePath }
    );

    chrppc.stdout.on('data', out => console.log(`[chrppc]: ${out}`));
    chrppc.stderr.on('data', out => console.log(`[chrppc, stderr]: ${out}`));

    const exitCode = await waitForProcessEnd(chrppc);
    return exitCode === 0;
}

async function runCompiler(compilePath: string) {
    const cpp = spawn(
        'c++',
        [
            '--std=c++20', // clang OK, gcc nope
            '-O2',
            '-o',
            'program',
            '-I/Users/tom/.bin/chrppc/usr/local/include/chrpp/',
            '-I.',
            
            ...readdirSync(compilePath).filter(f => f.endsWith('.cpp'))
        ],
        { cwd: compilePath }
    );
    
    cpp.stdout.on('data', out => console.log(`[c++]: ${out}`));
    cpp.stderr.on('data', out => console.log(`[c++, stderr]: ${out}`));

    const exitCode = await waitForProcessEnd(cpp);
    return exitCode === 0;
}

async function runProgram(compilePath: string, onStdin: CommandLineOutputCallback, onStderr: CommandLineOutputCallback) {
    const program = spawn(
        `${compilePath}/program`,
        [],
        { cwd: compilePath }
    );

    program.stdout.on('data', onStdin);
    program.stderr.on('data', onStderr);

    const [exitCode] = await Promise.all([waitForProcessEnd(program), waitForClosedInput(program.stdout), waitForClosedInput(program.stderr)])

    return exitCode;
}

function main() {
    const server = createServer();
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

    io.on('connection', (socket) => {
        socket.on('pushJob', async (code) => {
            const randomId = Math.floor(Math.random() * 10000);
            const compilePath = `${tmpdir()}/chr-ide-${randomId}`;

            mkdirSync(compilePath);
            console.log(`Compiling from ${socket.handshake.address} into ${compilePath}`);

            writeFileSync(`${compilePath}/main.chrpp`, code);

            socket.emit('transpiling');

            if(await runChrpp(compilePath)) {
                socket.emit('compiling');

                if(await runCompiler(compilePath)) {
                    let output = '';
                    const addToOutput = (line: string) => output = `${output}\n${line}`;

                    socket.emit('running');
                    const exitCode = await runProgram(compilePath, addToOutput, addToOutput);

                    socket.emit('finished', output, exitCode);
                } else {
                    socket.emit('error', 'cpp');
                }
            } else {
                socket.emit('error', 'chrpp');
            }
        });
    });

    server.listen(3000, () => console.log('Server running at http://localhost:3000'));
}

main();