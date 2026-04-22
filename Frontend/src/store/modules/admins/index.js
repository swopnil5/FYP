import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      users: [],
      profiles: [],
      counts: [],
      months: [],
    };
  },
  mutations,
  actions,
  getters,
};
