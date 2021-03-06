/* eslint-disable import/newline-after-import, import/order, no-unused-vars, global-require */

// TODO: put this file in the root of src (for some reason breaks in the docker container, probably template pointing to the wrong directory)

const {
  env,
  settings,
  state,
  webSocketServer,
  eventEmitter,
  logger,
  readyService,
  serialPortFactory,
  phidget,
  digitalOutputFactory,
  redIndicatorLight,
  orangeIndicatorLight,
  greenIndicatorLight,
  temperatureControllerFactory,
  serialDevices,
} = require('./container');

const waitForComponentStartup = () => {
  
  logger.info('components initializing');

  eventEmitter.emit('components.started', env.startup.time);

  const phidgetManager = require('./phidget-manager/phidget-manager')(env, phidget, logger);
  phidgetManager.connect();

  redIndicatorLight.listen();
  orangeIndicatorLight.listen();
  greenIndicatorLight.listen();

  let ready = false;
  return new Promise((resolve) => {
    eventEmitter.on('computer.time', ({ actual }) => {
      if (!ready) {
        eventEmitter.emit('components.progress', Math.floor(actual));
        if (actual > env.startup.time) {
          logger.info('connecting to components');
          eventEmitter.emit('components.complete');
          ready = true;
          readyService.listen();
          resolve();
        }
      }
    });
  });
};

const listen = () => {

  let pump;
  if (env.fid.pump.isAttached) {
    const pumpFactory = require('./pump/pump-factory')(digitalOutputFactory, eventEmitter);
    pump = pumpFactory.getNewPump(
      env.fid.pump.hub,
      env.fid.pump.port,
    );
    pump.listen();
  }

  let fc;
  if (env.fc.isAttached) {
    const AlicatHub = require('./serial-device/alicat/alicat-hub');
    const alicatDeviceFactory = require('./serial-device/alicat/alicat-device-factory')();
    fc = new AlicatHub(
      serialDevices.fc,
      serialPortFactory,
      eventEmitter,
      [
        alicatDeviceFactory.getNewFlowController('a', 'air'),
        alicatDeviceFactory.getNewFlowController('h', 'hydrogen'),
      ],
      state,
    );
  }

  let fidTemperatureController;
  let fid;
  if (env.fid.isAttached) {
    fidTemperatureController = temperatureControllerFactory.getNewTemperatureController(
      'fid',
      env.fid.temperatureSensor.hub,
      env.fid.temperatureSensor.port,
      env.fid.heater.hub,
      env.fid.heater.port,
      env.fid.heater.channel,
    );

    const Fid = require('./serial-device/fid');
    fid = new Fid(serialPortFactory, serialDevices, env.fid.sampleRate, eventEmitter, state);
  }

  const serialPortRegistrar = require('./serial-port/serial-port-registrar')(serialDevices, serialPortFactory, eventEmitter, logger);
  serialPortRegistrar.registerSerialPorts();
};

settings
  .load()
  .then(webSocketServer.listen)
  .then(waitForComponentStartup)
  .then(listen);
