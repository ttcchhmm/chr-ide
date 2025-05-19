import Docker from 'dockerode';
import Config from './config.js';
import { exit } from 'node:process';

let daemon: Docker | null = null;

/**
 * Build the scratch image.
 */
const buildScratchImage = async () => {
    if(daemon) {
        const stream = await daemon.buildImage(
            {
                context: '.',
                src: ['Dockerfile'],
            },
            {t: 'chr-ide-empty'}
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
}

/**
 * Check if Docker support is available.
 * @returns True if Docker support is available, false otherwise.
 */
export const isDockerAvailable = () => daemon !== null;