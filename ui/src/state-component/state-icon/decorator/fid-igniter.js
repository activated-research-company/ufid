function decorate(state) {
  const decoratedState = state;

  decoratedState.fidIgniter.icon = {
    on: 'flash-on',
    onColor: 'gold',
    off: 'flash-on',
    offColor: 'silver',
  };

  return decoratedState;
}

module.exports = (container) => {
  container.decorator('systemState', decorate);
};
