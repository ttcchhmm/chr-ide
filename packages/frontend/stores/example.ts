/**
 * Store managing the current state of the example to load.
 */
export const useExampleStore = defineStore('example', {
    state: () => ({
        /**
         * The example to load on workspace creation.
         */
        example: null as Example | null,
    }),
});