export const useChrStore = defineStore('chr', {
    state: () => ({
        code: '',
        watchedVariables: [] as string[],
        variables: [] as string[],
        constraints: [] as string[],
    }),
    actions: {
        getSaveFormat() {
            return {
                code: this.code,
                watchedVariables: this.watchedVariables,
                variables: this.variables,
                constraints: this.constraints,
            };
        },
    }
});