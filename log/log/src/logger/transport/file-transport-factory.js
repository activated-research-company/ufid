function getFileTransportFactory(winston, path, env) {
  function getNewFileTransport(url, handleExceptions) {

    const formatter = winston.format.printf(({ level, message, timestamp }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
      });
    });

    return new winston.transports.DailyRotateFile({
      dirname: path.join(env.persistentDataPath, 'log', url),
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30',
      format: formatter,
      handleExceptions,
    });
  }
  return {
    getNewFileTransport,
  };
}

module.exports = (container) => {
  container.service(
    'fileTransportFactory',
    getFileTransportFactory,
    'winston',
    'path',
    'env',
  );
};