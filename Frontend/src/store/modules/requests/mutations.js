export default {
  addRequest(state, payload) {
    state.requests.push(payload);
  },
  setServiceRequests(state, payload) {
    state.requests = payload;
  },
};
