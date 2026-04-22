import axios from "axios";
import router from "../../../router";
export default {
  async loadAdoptionPosts(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get("http://localhost:8080/api/v1/adoptions", {
        headers: { Authorization: "Bearer " + token },
      });
      const responseData = await response.data.posts;

      const posts = [];

      for (const key in responseData) {
        const post = {
          postId: responseData[key]._id,
          username: responseData[key].username,
          posterImageUrl: responseData[key].posterImageUrl,
          description: responseData[key].description,
          number: responseData[key].number,
          postImageUrl: responseData[key].postImages,
        };
        posts.push(post);
      }
      context.commit("setPosts", posts);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
  async getMyPosts(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/adoptions/myposts?auth=",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }

    const responseData = await response.data.postedPosts;

    const posts = [];

    for (const key in responseData) {
      const post = {
        postId: responseData[key].id,
        username: responseData[key].username,
        posterImageUrl: responseData[key].posterImageUrl,
        description: responseData[key].description,
        number: responseData[key].number,
        postImageUrl: responseData[key].postImages,
      };
      posts.push(post);
    }
    context.commit("setPosts", posts);
  },

  async addAdoptionPost(context, payload) {
    const token = context.rootGetters.token;

    const { ...postData } = payload;

    let response = "";
    try {
      response = await axios.post(
        " http://localhost:8080/api/v1/adoptions",
        postData,
        {
          headers: {
            Authorization: "Bearer " + token,

            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
    // const responseData = response.data.newPost;
    const newResponseData = {
      ...response.data.newPost,
      postImageUrl: response.data.newPost.postImages,
    };
    context.rootState.success = "Successfully created a post";
    context.commit("addAdoptionPost", newResponseData);
    //router.go(0);
  },
};
