export default {
  setPosts(state, payload) {
    state.posts = payload;
  },
  addAdoptionPost(state, payload) {
    state.posts.push(payload);
  },
};
