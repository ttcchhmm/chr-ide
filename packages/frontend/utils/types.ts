import type { CHRVariable } from "@chr-ide/core";

/**
 * A type that can accept both a callback and nothing.
 */
export type NullableCallback = (() => void) |  null;

/**
 * An example program.
 */
export type Example = {
    /**
     * Name of the example.
     */
    name: string,

    /**
     * The CHR code of the example.
     */
    code: string,

    /**
     * Constraints.
     */
    constraints: string[],

    /**
     * Watched variables.
     */
    variables: CHRVariable[],
};