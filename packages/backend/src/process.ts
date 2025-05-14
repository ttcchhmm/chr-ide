import Config from './config.js';
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import { spawn, type ChildProcess } from 'node:child_process';

/**
 * Wait for a process to end and return its exit code.
 * 
 * @param process - The process to wait for.
 * @returns - A promise that resolves when the process ends, with the exit code.
 */
const waitForProcessEnd = (process: ChildProcess) =>
    new Promise<number>(
        resolve => process.on('close', (code) => resolve(code ?? -1))
    );

const verboseProcessOutput = (process: ChildProcess) => {
    if(Config.verbose) {
        process.stdout?.on('data', (output: string) => console.log(`[STDOUT]: ${output}`));
        process.stderr?.on('data', (output: string) => console.log(`[STDERR]: ${output}`));
    }
};


/**
 * Setup the compilation environment.
 * 
 * @param code - The code to compile.
 * @returns A CHRPP code file ready to be compile.
 */
export const PrepareFile = async (code: string) => {

    let fileContent = await readFile("./src/skeleton.cpp", 'utf-8');
    fileContent = fileContent.replace("//Rules", code);

    return fileContent;
};

/**
 * Setup the compilation environment.
 * 
 * @param code - The code to compile.
 * @returns A promise that resolves to the path where the code should be compiled.
 */
export const setupCompilation = async (code: string) => {
    const randomId = Math.floor(Math.random() * 10000);
    const compilePath = `${Config.compileDirectory}/chr-ide-${randomId}`;

    await mkdir(compilePath);
    await writeFile(`${compilePath}/main.chrpp`, code);

    return compilePath;
};

/**
 * Run chrppc.
 * 
 * @param directory - The directory where the compilation should happen.
 * @returns A promise that resolves to true if the transpilation was successful, false otherwise.
 */
export const chrppc = async (directory: string) => {
    const transpiler = spawn(
        `${Config.chrppcInstallRoot}/usr/local/bin/chrppc`,
        [
            '--trace',
            '-sout',
            './main.chrpp',

        ],
        { cwd: directory }
    );

    let code = '';
    transpiler.stdout?.on('data', (output: string) => code += output);

    verboseProcessOutput(transpiler);

    const finishedProperly = await waitForProcessEnd(transpiler) === 0;

    if(finishedProperly) {
        await writeFile(`${directory}/main.cpp`, code);
    }

    return finishedProperly;
};


/**
 * Run the C++ compiler.
 * 
 * @param directory - The directory where the compilation should happen.
 * @returns A promise that resolves to true if the compilation was successful, false otherwise.
 */
export const cpp = async (directory: string) => {
    const compiler = spawn(
        Config.cppCompiler,
        [
            '--std=c++17', // TODO: issues with gcc?
            '-O0',
            '-o',
            'program',
            `-I${Config.chrppcInstallRoot}/usr/local/include/chrpp/`,
            '-I.',
            '-DENABLE_TRACE',

            ...Config.extraCompilerFlags.split(' ').filter(flag => flag.length > 0),
            ...(await readdir(directory)).filter(f => f.endsWith('.cpp'))
        ],
        { cwd: directory }
    );

    verboseProcessOutput(compiler);

    return await waitForProcessEnd(compiler) === 0;
};

/**
 * Run the compiled program.
 * 
 * @param directory - The directory where the program is located.
 * @param onStderr - A callback function to handle the output of the program.
 * @returns A promise that resolves to true if the program ran successfully, false otherwise.
 */
export const program = async (directory: string, onStderr: (line: string) => void) => {
    const p = spawn(
        `${directory}/program`,
        [],
        { cwd: directory }
    );

    p.stdout.on('data', (b: Buffer | string) => onStderr(b.toString()));
    return await waitForProcessEnd(p) === 0;
};