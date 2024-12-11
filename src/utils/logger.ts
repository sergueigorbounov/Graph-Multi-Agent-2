export const logger = {
  logs: [] as string[],
  log(message: string) {
    this.logs.push(message);
    console.log(message);
  },
  error(message: string) {
    this.logs.push(`ERROR: ${message}`);
    console.error(message);
  },
  getLogs() {
    return this.logs;
  },
};
