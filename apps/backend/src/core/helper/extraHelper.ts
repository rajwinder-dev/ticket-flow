export class log {
  static green = (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`);
  static yellow = (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`);
  static cyan = (msg: string) => console.log(`\x1b[36m${msg}\x1b[0m`);
  static magenta = (msg: string) => console.log(`\x1b[35m${msg}\x1b[0m`);
}
