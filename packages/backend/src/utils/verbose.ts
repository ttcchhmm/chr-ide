import Config from "../config.js";

/**
 * Log something when verbose mode is enabled. Is a no-op otherwise.
 * 
 * Wrapper around `console.log`.
 */
export default Config.verbose ? console.log : (_msg: any, ..._params: any[]) => {};