function getLoggerFactory(winston, { log }) {
  const logLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

  function getNewLogger() {
    return winston.createLogger({
      level: logLevels[Math.max(log.level, logLevels.length - 1)],
      format: winston.format.timestamp(),
      transports: [],
    });
  }

  return {
    getNewLogger,
  };
}

module.exports = (container) => {
  container.service('loggerFactory', getLoggerFactory, 'winston', 'env');
};
