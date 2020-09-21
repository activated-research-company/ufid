// we cannot destructure this line because webpack needs 'process.env' to fill properly
// eslint-disable-next-line prefer-destructuring
const env = process.env;

function getEnv(app, path) {
  // TODO: validate env config and throw errors if something isn't found instead of taking defaults in code

  function getDataPath(directory) {
    if (directory && directory[0] === '~') {
      return path.join(env.HOME, directory.slice(1));
    }
    return directory;
  }

  return {
    uuid: env.BALENA_DEVICE_UUID,
    log: {
      host: env.LOG_HOST,
      port: parseInt(env.LOG_PORT, 10),
      level: parseInt(env.LOG_LEVEL, 10),
    },
    api: {
      host: env.CONTROL_HOST,
      port: env.CONTROL_PORT,
    },
    ui: {
      host: env.UI_HOST,
    },
    dev: env.NODE_ENV && env.NODE_ENV === 'development',
    // persistentDataPath: getDataPath(env.DATA_PATH) || app.APPDATA,
    screenSleepTime: env.SCREEN_SLEEP_TIME,
  };
}

module.exports = (container) => {
  container.service('env', getEnv, 'app', 'path');
};