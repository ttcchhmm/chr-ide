# About
This workspace contains the backend source. The source code is stored in the [`src`](src) folder.

# Configuration
> [!CAUTION]
> **Docker users, STOP!**
>
> The Docker image is already built to work without configuration.
> 
> The only configuration variable that you can change is `CHR_IDE_ALLOWED_ORIGINS`, if you're hosting CHR IDE over a network.

The following environment variables can be used to configure the behavior of CHR IDE:
- `CHR_IDE_PORT`: Set the port used by the server.
  - Defaults to `3000`.
- `CHR_IDE_CHRPPC_ROOT`: Directory where `chrppc` is installed, should be the same value that the one used for `DESTDIR` when running `make install` inside the CHR++ repository.
  - Defaults to the system root.
- `CHR_IDE_COMPILE_DIRECTORY`: Directory where the compilation jobs will run.
  - Defaults to the result of [`os.tmpdir()`](https://nodejs.org/api/os.html#ostmpdir).
- `CHR_IDE_CPP_COMPILER`: Path to a C++ compiler
  - Defaults to `c++`.
- `CHR_IDE_EXTRA_COMPILER_FLAGS`: Extra flags to pass to the C++ compiler.
  - Defaults to an empty string.
- `CHR_IDE_VERBOSE`: Whether to enable verbose mode or not.
  - Defaults to `false` in production, `true` in development.
- `CHR_IDE_ALLOWED_ORIGINS`: Origins allowed to contact this server, used for the `Access-Control-Allow-Origin` CORS header. Should be a list of allowed origins, separated by commas.
  - Default to `http://localhost:3000,http://localhost:4000`.

# Major dependencies
- [**Node.js**](https://nodejs.org): JavaScript runtime
- [**Socket.io**](https://socket.io/): Client/server communication
- [**Express**](https://expressjs.com/): Serve static files, CORS management