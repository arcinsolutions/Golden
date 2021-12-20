module.exports = {
  name: "raw",
  once: false,
  execute(data, _, client) {
    client.manager.updateVoiceState(data);
  },
};
