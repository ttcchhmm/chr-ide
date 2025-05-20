import { tmpdir } from 'node:os'

/**
 * Configuration values for the app.
 */
const config = Object.freeze({
    /**
     * Port used by the server.
     * 
     * Set by the `CHR_IDE_WS_PORT` environment variable, defaults to 3000.
     */
    port: process.env.CHR_IDE_PORT ?? '3000',

    /**
     * Directory where `chrppc` is installed.
     * 
     * Should be the same value that the one used for `DESTDIR` when running `make install` inside the chrpp repository.
     * 
     * Set by the `CHR_IDE_CHRPPC_ROOT` environment variable, defaults to the system root.
     */
    chrppcInstallRoot: process.env.CHR_IDE_CHRPPC_ROOT ?? '',

    /**
     * Directory where the compilation jobs will run.
     * 
     * Set by the `CHR_IDE_COMPILE_DIRECTORY` environment variable, defaults to the result of [`os.tmpdir()`](https://nodejs.org/api/os.html#ostmpdir).
     */
    compileDirectory: process.env.CHR_IDE_COMPILE_DIRECTORY ?? tmpdir(),

    /**
     * Path to a C++ compiler.
     * 
     * Set by the `CHR_IDE_CPP_COMPILER` environment variable, defaults to `c++`.
     */
    cppCompiler: process.env.CHR_IDE_CPP_COMPILER ?? 'c++',

    /**
     * Extra flags to pass to the C++ compiler.
     * 
     * Set by the `CHR_IDE_EXTRA_COMPILER_FLAGS` environment variable, defaults to an empty string.
     */
    extraCompilerFlags: process.env.CHR_IDE_EXTRA_COMPILER_FLAGS ?? '',

    /**
     * Whether to enable verbose mode or not.
     * 
     * Set by the `CHR_IDE_VERBOSE` environment variable. Should be set to `true` to enable it. Defaults to false in production, true in development.
     */
    verbose: process.env.CHR_IDE_VERBOSE === undefined ? process.env.NODE_ENV !== 'production' : process.env.CHR_IDE_VERBOSE === 'true',

    /**
     * Origins allowed to contact this server. Used for the `Access-Control-Allow-Origin` CORS header.
     * 
     * Set by the `CHR_IDE_ALLOWED_ORIGINS` environment variable. Should be set to a list of allowed origins, separated by commas. Defaults to `http://localhost:3000,http://localhost:4000`.
     */
    allowedOrigins: process.env.CHR_IDE_ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:4000',

    /**
     * Whether to keep code and programs after execution.
     * 
     * Set by the `CHR_IDE_KEEP_DATA` environment variable. Should be set to `true` to enable it. Defaults to false in production, true in development.
     */
    keepData: process.env.CHR_IDE_KEEP_DATA === undefined ? process.env.NODE_ENV !== 'production' : process.env.CHR_IDE_KEEP_DATA === 'true',

    /**
     * Whether or not to run compiled programs in a dedicated Docker container.
     * 
     * Possible values:
     * - `no`: Always run programs locally.
     * - `yes`: Always run programs in Docker. Fails to start if Docker isn't reachable.
     * - `auto`: Try running programs in Docker, but fallback to running locally if Docker isn't reachable.
     * 
     * Set by the `CHR_IDE_PROGRAMS_RUN_IN_DOCKER` environment variable. Defaults to `auto`.
     */
    executeInDocker: process.env.CHR_IDE_PROGRAMS_RUN_IN_DOCKER ?? 'auto',

    /**
     * Name of the Docker volume where build artifacts are written to.
     * 
     * Used when running programs in Docker, to properly mount their executable in the newly created empty container.
     * 
     * Set by the `CHR_IDE_BUILD_VOLUME_NAME` environment variable. Defaults to nothing.
     */
    dockerBuildVolume: process.env.CHR_IDE_BUILD_VOLUME_NAME ?? null,
});

export default config;