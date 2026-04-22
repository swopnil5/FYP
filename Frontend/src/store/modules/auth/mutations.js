export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.role = payload.role;
  },
  setAdmin(state, payload) {
    state.admins = payload;
  },
};
