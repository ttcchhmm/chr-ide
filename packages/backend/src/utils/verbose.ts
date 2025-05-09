import Config from "../config.js";

/**
 * Log something when verbose mode is enabled. Is a no-op otherwise.
 * 
 * Wrapper around `console.log`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- console.log uses 'any' and we're mocking it.
export default Config.verbose ? console.log : (_msg: any, ..._params: any[]) => {};