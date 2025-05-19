export const useInputWithButtonStore = defineStore('input-with-button', {
    state: () => ({
        count: 0,
    }),

    actions: {
        increment() {
            const current = this.count;
            this.count++;
            return current;
        }
    }
});