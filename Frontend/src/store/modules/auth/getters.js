export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  role(state) {
    return state.role;
  },
  admins(state) {
    return state.admins;
  },
  isLoggedIn(state) {
    return !!state.token;
  },
  isAdmin(_, getters, _2, rootGetters) {
    // const admins = getters.admins;
    const userId = rootGetters.userId;

    return "68259f2e35c2aff82a227105" == userId;
    // return true
  },
};
