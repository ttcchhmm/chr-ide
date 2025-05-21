import Config from './config.js';
import { mkdir, writeFile, readdir, readFile, access, constants } from 'node:fs/promises';
import { spawn, type ChildProcess } from 'node:child_process';
import { CHRVariable } from '@chr-ide/core';
import verbose from './utils/verbose.js';

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
 * Check that `chrppc` is available.
 * @returns A promise that resolve to true if `chrppc` is available, false otherwise.
 */
export const checkForChrppc = async () => {
    try {
        await access(`${Config.chrppcInstallRoot}/usr/local/bin/chrppc`, constants.X_OK);
        return true;
    } catch(_e) {
        return false;
    }
};

/**
 * Check that a C++ compiler is available.
 * @returns A promise that resolves to true if a C++ compiler is available, false otherwise.
 */
export const checkForCompiler = async () => {
    const compiler = spawn(
        Config.cppCompiler,
        [
            '--version',
        ],
    );

    compiler.stdout.on('data', (input: Buffer) => console.log(`[c++]: ${input.toString().split('\n')[0]}`));

    return await waitForProcessEnd(compiler) === 0;
};

export const prepareFile = async (code: string, constraints: string[], watch: CHRVariable[]) => {
    let fileContent = await readFile("./skeleton.cpp", 'utf-8');
    
    // Protect against code injection
    code = code.replaceAll(/(\/\*)|(\*\/)|(<\/CHR>)/gi, '');

    constraints = constraints.map(constraint => 
        constraint.replace(/\/\*[\s\S]*?\*\//g, '')
    );
        

    fileContent = fileContent.replace("//Rules", code);
    fileContent = fileContent.replace(
        "//Constraints",
        constraints.map(constraint => "space->" + constraint + ";").join('\n')
    );


    const template = `for (auto& c : space->get_//constraint_store()){
        std::cout << "TRACE [VAR][//constraint///position][" << *std::get<//position>(c)<<"]"<< std::endl;
    }
    `;

    fileContent = fileContent.replace("//Store", watch.map((item) => 
        template
            .replace(/\/\/constraint/g, item.constraint)
            .replace(/\/\/position/g, item.position.toString())
    ).join('\n'));

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
 * @param compileStatic - Whether or not to compile the program statically.
 * @returns A promise that resolves to true if the compilation was successful, false otherwise.
 */
export const cpp = async (directory: string, compileStatic: boolean) => {
    const flags = [
        '--std=c++17', // TODO: issues with gcc?
        '-O0',
        '-o',
        'program',
        `-I${Config.chrppcInstallRoot}/usr/local/include/chrpp/`,
        '-I.',
        '-DENABLE_TRACE',

        ...Config.extraCompilerFlags.split(' ').filter(flag => flag.length > 0),
        ...(await readdir(directory)).filter(f => f.endsWith('.cpp'))
    ];

    if(compileStatic) {
        flags.push('-static');
    }

    verbose(`[C++]: Compile flags:\n${flags.join(' ')}`);

    const compiler = spawn(
        Config.cppCompiler,
        flags,
        { cwd: directory }
    );

    verboseProcessOutput(compiler);

    return await waitForProcessEnd(compiler) === 0;
};

/**
 * Run the compiled program.
 * 
 * @param directory - The directory where the program is located.
 * @param onStdout - A callback function to handle the output of the program.
 * @returns A promise that resolves to true if the program ran successfully, false otherwise.
 */
export const program = async (directory: string, onStdout: (line: string) => void) => {
    const p = spawn(
        `${directory}/program`,
        [],
        { cwd: directory }
    );

    p.stdout.on('data', (b: Buffer | string) => onStdout(b.toString()));

    // Setup the timeout
    let running = true;
    setTimeout(() => {
        if(running) {
            console.warn(`[${directory}/program]: Ran for more than ${Config.executionTimeout} ms, killing.`);
            p.kill('SIGKILL');
        }
    }, Config.executionTimeout);

    const isProperExit = await waitForProcessEnd(p) === 0;
    running = false;

    return isProperExit;
};