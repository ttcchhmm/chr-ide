import { tmpdir } from 'node:os'

/**
 * Configuration values for the app.
 */
const config = Object.freeze({
    /**
     * Port used by the WebSocket server.
     * 
     * Set by the `CHR_IDE_WS_PORT` environment variable, defaults to 3000.
     */
    wsPort: process.env.CHR_IDE_WS_PORT ?? '3000',

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
});

export default config;