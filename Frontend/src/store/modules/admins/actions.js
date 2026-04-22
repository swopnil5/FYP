import axios from "axios";
import router from "../../../router";

export default {
  async loadAllUsers(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get("http://localhost:8080/api/v1/admins/users", {
        headers: { Authorization: "Bearer " + token },
      });
      const responseData = await response.data.users;
      const users = [];
      for (const key in responseData) {
        const user = {
          id: responseData[key]._id,
          name: responseData[key].name,
          email: responseData[key].email,
          role: responseData[key].role,
          createdAt: responseData[key].createdAt,
        };
        users.push(user);
      }
      context.commit("setUsers", users);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
  async deleteUser(context, payload) {
    const userId = payload;
    const token = context.rootGetters.token;

    let response = "";
    try {
      response = await axios({
        method: "patch",
        url: `http://localhost:8080/api/v1/admins/${userId}/deleteuser`,
        headers: { Authorization: "Bearer " + token },
      });
      let users = context.state.users;
      const updatedUsers = users.filter((user) => user.id != userId);
      context.commit("setUsers", updatedUsers);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
  //find User

  /* async loadAllProfiles(context) {
    const token = context.rootGetters.token;
    const response = await axios.get(
      "http://localhost:8080/api/v1/admins/profiles",
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    const responseData = await response.data.profiles;

  }, */
  //we can use Caretakers wala module ko load Caretakers
  async loadAllProfiles(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/admins/profiles",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data.profiles;
      const profiles = [];
      for (const key in responseData) {
        const user = {
          profileId: responseData[key]._id,
          userId: responseData[key].profileOf,
          username: responseData[key].username,
          profileImageUrl: responseData[key].profileImageUrl,
          name: responseData[key].name,
          email: responseData[key].email,
          speciality: responseData[key].speciality,
          contact: responseData[key].contact,
          location: responseData[key].location,
          verificationStatus: responseData[key].verificationStatus,
          verificationAttachments: responseData[key].verificationAttachments,
          createdAt: responseData[key].createdAt,
        };
        profiles.push(user);
      }
      context.commit("setProfiles", profiles);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },

  async verifyProfile(context, payload) {
    const profileId = payload;
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios({
        method: "patch",
        url: `http://localhost:8080/api/v1/admins/profiles/${profileId}/verifyprofile`,
        headers: { Authorization: "Bearer " + token },
      });
      context.rootState.success = "Profile Verified";

      router.go(0);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
  async userCount(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get("http://localhost:8080/api/v1/admins/counts", {
        headers: { Authorization: "Bearer " + token },
      });
      const responseData = response.data.counts;
      let months = [];
      let counts = [];
      responseData.forEach((count) => {
        months.push(count.month);
        counts.push(count.numberofdocuments);
      });

      context.commit("setMonths", months);
      context.commit("setCounts", counts);
    } catch (error) {
      console.log(error);
    }
  },
};
