import * as winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `/src/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const logger = winston.default.createLogger({
  level: 'info',
  format: winston.default.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.default.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.default.transports.File({ filename: 'combined.log' }),
    new winston.default.transports.Console(options.console)
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message) {
    logger.info(message);
  },
};

export default logger;
