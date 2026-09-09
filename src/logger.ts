type env = 'dev' | 'prod';

export class Logger {
  constructor(private readonly env: env) {}

  log(...args: unknown[]): void {
    if (this.env === 'dev') {
      console.log(...args);
    }
  }

  static logger(...args: unknown[]): void {
    console.log(...args);
  }
}

/* const name = 'karan';

const data = {
    name: 'John Doe',
}

const arr = [1, 2, 3, 4, 5]; */

// // ===========instance========
// const logger = new Logger('dev');
// logger.log(`dev instance log message ${name}`, data, arr);

// // =========prod instance========
// const logger2 = new Logger('prod');
// logger2.log(`prod instance log message ${name}`, data, arr);

// // ========static========
// Logger.logger("static log message");