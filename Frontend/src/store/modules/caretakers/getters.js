export default {
  caretakers(state) {
    return state.caretakers;
  },
  recommendedCaretakers(state) {
    return state.recommendedCaretakers;
  },
  hasCaretakers(state) {
    return state.caretakers && state.caretakers.length > 0;
  },
  isCaretaker(_, getters, _2, rootGetters) {
    const caretakers = getters.caretakers;
    const userId = rootGetters.userId;
    const userRole = rootGetters.role;
    console.log(userRole, 'userRole');
    return userRole === "caretaker" ? true : false;
  },

  myProfile(state) {
    return state.profile;
  },
  hasProfile(state) {
    return !!state.profile;
  },
  isVerified(_, getters, _2, rootGetters) {
    const caretaker = getters.myProfile;
    const userId = rootGetters.userId;

    if (
      caretaker[0].verificationStatus == "verified" ||
      caretaker[0].verificationStatus == "pending"
    ) {
      return true;
    }
    return false;
  },
};
