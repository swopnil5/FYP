import axios from "axios";
import router from "../../../router";
export default {
  async addProfile(context, payload) {
    const token = context.rootGetters.token;

    const caretakersData = {
      username: payload.username,
      profilePic: payload.profileImageUrl,
      email: payload.email,
      name: payload.name,
      bio: payload.bio,
      speciality: payload.speciality,
      rate: payload.rate,
      contact: payload.contact,
      location: payload.location,
      verificationStatus: "pending",
    };
    let response = "";
    try {
      response = await axios.post(
        "http://localhost:8080/api/v1/profiles",
        {
          ...caretakersData,
        },
        {
          headers: {
            Authorization: "Bearer " + token,

            "Content-Type": "multipart/form-data",
          },
        }
      );
      context.rootState.success = "Created Profile Successfully";
      context.commit("setProfile", caretakersData);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },

  async loadCaretakers(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/profiles/caretakers",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data.profiles;

      const caretakers = [];

      for (const key in responseData) {
        const caretaker = {
          profileId: responseData[key]._id,
          userId: responseData[key].profileOf,
          username: responseData[key].username,
          profileImageUrl: responseData[key].profileImageUrl,
          email: responseData[key].email,
          name: responseData[key].name,
          bio: responseData[key].bio,
          speciality: responseData[key].speciality,
          rate: responseData[key].rate,
          contact: responseData[key].contact,
          location: responseData[key].location,
          verificationStatus: responseData[key].verificationStatus,
          totalRatings: responseData[key].totalRatings,
          averateRating: responseData[key].averateRating,
        };
        caretakers.push(caretaker);
      }
      context.commit("setCaretakers", caretakers);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },

  async loadRecommendedCaretakers(context) {
    // api: GET http://localhost:8080/api/v1/recommendation
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/recommendation",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data.data;

      const caretakers = [];

      for (const key in responseData) {
        const caretaker = {
          profileId: responseData[key]._id,
          userId: responseData[key].profileOf,
          username: responseData[key].username,
          profileImageUrl: responseData[key].profileImageUrl,
          email: responseData[key].email,
          name: responseData[key].name,
          bio: responseData[key].bio,
          speciality: responseData[key].speciality,
          rate: responseData[key].rate,
          contact: responseData[key].contact,
          location: responseData[key].location,
          verificationStatus: responseData[key].verificationStatus,
          totalRatings: responseData[key].totalRatings,
          averateRating: responseData[key].averateRating,
        };
        caretakers.push(caretaker);
      }
      context.commit("setRecommendedCaretakers", caretakers);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },

  async getMyProfile(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get("http://localhost:8080/api/v1/profiles", {
        headers: { Authorization: "Bearer " + token },
      });
      const responseData = await response.data;

      const profile = [
        {
          profileId: responseData._id,
          userId: responseData.profileOf,
          username: responseData.username,
          imageUrl: responseData.profileImageUrl,
          email: responseData.email,
          name: responseData.name,
          bio: responseData.bio,
          speciality: responseData.speciality,
          rate: responseData.rate,
          contact: responseData.contact,
          location: responseData.location,
          verificationStatus: responseData.verificationStatus,
          totalRatings: responseData.totalRatings,
          averageRating: responseData.averageRating,
          totalEarnings: responseData.totalEarnings,
          pendingEarnings: responseData.pendingEarnings,
        },
      ];

      context.commit("setProfile", profile);
    } catch (error) {
      console.log(error);
    }
  },
  async sendVerificationRequest(context, payload) {
    const token = context.rootGetters.token;

    const verificationDetails = {
      text: payload.text,

      files: payload.files,
    };
    let response = "";
    try {
      response = await axios.patch(
        "http://localhost:8080/api/v1/profiles/applyverification",
        {
          ...verificationDetails,
        },
        {
          headers: {
            Authorization: "Bearer " + token,

            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data.updatedProfile;
      context.commit("setProfile", responseData);
      context.rootState.success = "Verification Request Sent";
      router.replace("/myprofile");
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
  async updateMyProfile(context, payload) {
    const token = context.rootGetters.token;

    const profileData = {
      username: payload.username,
      profilePic: payload.profileImageUrl,

      name: payload.name,
      bio: payload.bio,

      rate: payload.rate,
      contact: payload.contact,
      location: payload.location,
    };

    /* const response = await axios({
      method: "patch",
      url: "http://localhost:8080/api/v1/profiles/updateMyProfile",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    }); */
    let response = "";
    try {
      response = await axios.patch(
        "http://localhost:8080/api/v1/profiles/updateMyProfile",
        {
          ...profileData,
        },
        {
          headers: {
            Authorization: "Bearer " + token,

            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data.updatedProfile;
      const profile = [
        {
          profileId: responseData._id,
          userId: responseData.profileOf,
          username: responseData.username,
          imageUrl: responseData.profileImageUrl,
          email: responseData.email,
          name: responseData.name,
          bio: responseData.bio,
          speciality: responseData.speciality,
          rate: responseData.rate,
          contact: responseData.contact,
          location: responseData.location,
          verificationStatus: responseData.verificationStatus,
          totalRatings: responseData.totalRatings,
          averageRating: responseData.averageRating,
          totalEarnings: responseData.totalEarnings,
          pendingEarnings: responseData.pendingEarnings,
        },
      ];
      context.rootState.success = "Profile Updated Successfully.";
      context.commit("setProfile", profile);
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }
  },
};
