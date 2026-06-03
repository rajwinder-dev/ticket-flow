export class log {
    static reset = "\x1b[0m";
    static info(msg) {
        console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
    }
    static success(msg) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
    }
    static warn(msg) {
        console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
    }
    static error(msg) {
        console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
    }
    static debug(msg) {
        console.log(`\x1b[90m[DEBUG]\x1b[0m ${msg}`);
    }
    static data(label, data) {
        console.log(`\x1b[35m[DATA] ${label}:\x1b[0m`);
        console.dir(data, { depth: null, colors: true });
    }
}
//# sourceMappingURL=log.util.js.map