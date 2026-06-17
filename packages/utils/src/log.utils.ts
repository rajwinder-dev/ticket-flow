export class log {
  static reset = "\x1b[0m";

  static info(msg: string) {
    console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
  }

  static success(msg: string) {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
  }

  static warn(msg: string) {
    console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
  }

  static error(msg: string) {
    console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  }

  static debug(msg: string) {
    console.log(`\x1b[90m[DEBUG]\x1b[0m ${msg}`);
  }
  static data(label: string, data: unknown) {
    console.log(`\x1b[35m[DATA] ${label}:\x1b[0m`);
    console.dir(data, { depth: null, colors: true });
  }
}
