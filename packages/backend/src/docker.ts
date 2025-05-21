import Docker from 'dockerode';
import Config from './config.js';
import { exit } from 'node:process';
import verbose from './utils/verbose.js';

let daemon: Docker | null = null;

/**
 * Build the scratch image.
 */
const buildScratchImage = async () => {
    if(daemon) {
        const stream = await daemon.buildImage(
            {
                context: '.',
                src: ['Dockerfile', '.empty'],
            },
            {t: 'chr-ide-empty:latest'}
        );

        // https://github.com/apocas/dockerode#building-an-image
        await new Promise((resolve, reject) => daemon?.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res)));
    }
};

/**
 * Set up Docker support, if enabled.
 * @returns A promise that resolves once Docker support is finished setting itself up.
 */
export const setupDocker = async () => {
    // Since the compilation is started as a child of the Node process, the output will be for the same platform as the one we're currently
    // running on. Docker will only run Linux executables, so we need to enforce something here.
    if(process.platform !== 'linux') {
        console.warn('Running programs in Docker is only supported on Linux hosts. The value of CHR_IDE_EXECUTE_IN_DOCKER is ignored.');
        console.warn("PROGRAMS WON'T BE RUN IN DEDICATED CONTAINERS. THIS CAN BE INSECURE, PROCEED WITH CAUTION!");
        return;
    }
    
    if(Config.executeInDocker !== 'no') {
        // Check if the name of the build volume is provided.
        if(Config.dockerBuildVolume === null && Config.dockerBuildVolume === '') {
            console.error('Trying to enable Docker support, but no name for the build volume was provided!');
            console.error('See https://github.com/ttcchhmm/chr-ide/blob/main/packages/backend/README.md#configuration to learn more.');

            if(Config.executeInDocker === 'auto') {
                console.warn('Falling back to running programs in the same context as this process.');
                console.warn("THIS CAN BE INSECURE, PROCEED WITH CAUTION!");
    
                return;
            } else {
                exit(1);
            }
        }

        daemon = new Docker();

        try {
            await daemon.ping();
        } catch(_e) {
            console.error('Failed to ping the Docker daemon!');

            if(Config.executeInDocker === 'yes') {
                console.error('CHR IDE is configured to always run programs in Docker. Since the Docker daemon is unreachable, CHR IDE will now exit.');
                console.error('See https://github.com/ttcchhmm/chr-ide/blob/main/packages/backend/README.md#configuration to learn more.');

                exit(1);
            } else {
                console.warn('Falling back to running programs in the same context as this process.');
                console.warn("THIS CAN BE INSECURE, PROCEED WITH CAUTION!");
            }

            daemon = null;
            return;
        }
        
        await buildScratchImage();

        console.log('Docker support is ready.');
    } else {
        console.warn("PROGRAMS WON'T BE RUN IN DEDICATED CONTAINERS. THIS CAN BE INSECURE, PROCEED WITH CAUTION!");
    }
};

/**
 * Run a program in a scratch container.
 * @param programPath The path of the program on the host to run.
 * @param onOutput Callback called when the program output something to stdout.
 */
export const runInContainer = async (programPath: string, onOutput: (output: string) => void) => {
    if(daemon) {
        // Create the container
        const container = await daemon.createContainer({
            Image: 'chr-ide-empty',
            Cmd: [programPath],
            Tty: true,
            HostConfig: {
                Binds: [
                    `${Config.dockerBuildVolume}:${Config.compileDirectory}:ro`,
                ],
                CapDrop: ['ALL'], // https://docs.docker.com/engine/security/#linux-kernel-capabilities
                NetworkMode: 'none',
            },
        });

        // Start the container
        verbose(`Starting container ${container.id}.`);
        await container.start();
        let running = true;

        // Setup the timeout
        setTimeout(() => {
            if(running) {
                console.warn(`[Docker ${container.id}]: Ran for more than ${Config.executionTimeout} ms, stopping.`);
                void container.stop();
            }
        }, Config.executionTimeout);

        // Attach to the container's logs
        const stream = await container.logs({ follow: true, stdout: true });

        let buffer = '';
        stream.on('data', (chunk: string | Buffer) => {
            const data = chunk.toString();
            verbose(`\n[Docker ${container.id}]: Log data received\n${data}`);

            const lines = (buffer + data).split('\n');
            buffer = lines.pop() || '';

            onOutput(lines.join('\n'));
        });

        stream.on('end', () => {
            if(buffer) {
                onOutput(buffer);
            }
        });

        // Wait for the container to finish
        await container.wait();
        running = false;

        verbose(`Container ${container.id} has finished execution.`);

        // Slight delay to make sure that we got time to read the logs
        setTimeout(() => void container.remove(), 1000);
    } else {
        throw new Error('Docker support is not enabled.');
    }
};

/**
 * Check if Docker support is available.
 * @returns True if Docker support is available, false otherwise.
 */
export const isDockerAvailable = () => daemon !== null;