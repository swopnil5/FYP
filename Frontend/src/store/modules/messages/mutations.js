export default {
  sendMessage(state, payload) {
    state.messages.push(payload);
  },
  viewMessage(state, payload) {
    state.messages = payload;
  },
};
