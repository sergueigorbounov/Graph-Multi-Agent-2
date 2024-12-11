export const logger = {
    logs: [],
    log(message) {
        this.logs.push(message);
        console.log(message);
    },
    error(message) {
        this.logs.push(`ERROR: ${message}`);
        console.error(message);
    },
    getLogs() {
        return this.logs;
    },
};
