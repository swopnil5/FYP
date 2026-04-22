import axios from "axios";
export default {
  async sendMessage(context, payload) {
    const token = context.rootGetters.token;

    const caretakerId = payload.caretakerId;
    const messageData = {
      message: payload.message,
      email: payload.email,
    };
    let response = "";
    try {
      response = await axios.post(
        `http://localhost:8080/api/v1/messages/${caretakerId}`,
        {
          ...messageData,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }

    context.rootState.success = "Message Sent Successfully";
    context.commit("sendMessage", messageData);
  },

  async getMessages(context) {
    const token = context.rootGetters.token;

    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/messages/myhistory",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
    } catch (error) {
      context.rootState.error = error.response.data.message;
    }

    const responseData = await response.data.history;

    const messages = [];

    for (const key in responseData) {
      const message = {
        senderId: responseData[key].from,
        senderEmail: responseData[key].email,
        message: responseData[key].message,
      };
      messages.push(message);
    }
    context.commit("viewMessage", messages);
  },
};
