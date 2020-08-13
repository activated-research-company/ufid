const { env } = process;

function getEnv(path) {
  const isDev = env.NODE_ENV === 'development'

  if (isDev) {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const dotenv = require('dotenv');
    dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') });
    dotenv.config();
  }

  function getDataPath(directory) {
    if (directory[0] === '~') {
      return path.join(env.HOME, directory.slice(1));
    }
    return directory;
  }

  function isTrue(envVar) {
    return envVar === 'true';
  }

  return {
    isDev,
    dataPath: getDataPath(env.DATA_PATH),
    log: {
      host: env.LOG_HOST,
      port: parseInt(env.LOG_PORT, 10),
      level: parseInt(env.LOG_LEVEL, 10),
    },
    phidget: {
      host: env.PHIDGET_HOST,
      port: parseInt(env.PHIDGET_PORT, 10),
      useSim: isTrue(env.PHIDGET_USE_SIM),
    },
    control: {
      host: env.CONTROL_HOST,
      port: parseInt(env.CONTROL_PORT, 10),
    },
    influxdb: {
      host: env.INFLUXDB_HOST,
      port: env.INFLUXDB_PORT,
    },
    startup: {
      time: parseInt(env.STARTUP_TIME, 10),
      useSim: isTrue(env.STARTUP_USE_SIM),
    },
    fc: {
      isAttached: isTrue(env.FC_IS_ATTACHED),
      useSim: isTrue(env.FC_USE_SIM),
      simPort: env.FC_SIM_PORT,
      baudRate: parseInt(env.FC_BAUD_RATE, 10),
    },
    fid: {
      isAttached: isTrue(env.FID_IS_ATTACHED),
      useSim: isTrue(env.FID_USE_SIM),
      simPort: env.FID_SIM_PORT,
      sampleRate: parseInt(env.FID_SAMPLE_RATE, 10),
      temperatureSensor: {
        isAttached: isTrue(env.FID_TEMPERATURE_SENSOR_IS_ATTACHED),
        hub: parseInt(env.FID_TEMPERATURE_SENSOR_HUB),
        port: parseInt(env.FID_TEMPERATURE_SENSOR_PORT),
      },
      heater: {
        isAttached: isTrue(env.FID_HEATER_IS_ATTACHED),
        hub: parseInt(env.FID_HEATER_HUB),
        port: parseInt(env.FID_HEATER_PORT),
      },
    },
    light: {
      red: {
        isAttached: isTrue(env.RED_LIGHT_IS_ATTACHED),
        hub: parseInt(env.RED_LIGHT_HUB),
        port: parseInt(env.RED_LIGHT_PORT),
      },
      orange: {
        isAttached: isTrue(env.ORANGE_LIGHT_IS_ATTACHED),
        hub: parseInt(env.ORANGE_LIGHT_HUB),
        port: parseInt(env.ORANGE_LIGHT_PORT),
      },
      green: {
        isAttached: isTrue(env.GREEN_LIGHT_IS_ATTACHED),
        hub: parseInt(env.GREEN_LIGHT_HUB),
        port: parseInt(env.GREEN_LIGHT_PORT),
      },
    },
  };
}

module.exports = (container) => {
  container.service('env', getEnv, 'path');
};
