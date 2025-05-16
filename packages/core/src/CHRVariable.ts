/**
 * Representation of a variable in a CHR program.
 */
export type CHRVariable = {
    /**
     * Constraint containing the variable.
     */
    constraint: string,

    /**
     * Position of the variable in the constraint.
     */
    position: number,

    /**
     * The value of the variable.
     */
    value: string,
};