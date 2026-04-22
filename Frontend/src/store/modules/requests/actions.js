import axios from "axios";

export default {
  async contactCaretaker(context, payload) {
    const token = context.rootGetters.token;
    const caretakerId = payload.receiversId;
    const newRequest = {
      serviceType: payload.serviceType,
      serviceOf: payload.serviceOf,
      pickUpDate: payload.pickUpDate,
      dropOffDate: payload.dropOffDate,
    };
    let response = "";
    try {
      response = await axios.post(
        `http://localhost:8080/api/v1/services/${caretakerId}`,
        {
          ...newRequest,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      context.rootState.success = `Contacted for the request`; //same code as above line but just removed middle part
      const paymentUrl = response?.data?.khaltiResponse?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setTimeout(() => {
          window.location.href = window.location.origin + "/myservices";
        }, 500);
      }

      context.commit("addRequest", newRequest);
    } catch (error) {
      console.log(error);
      context.rootState.error = error.response.data.message;
    }

  },
  async getContactRequests(context) {
    const token = context.rootGetters.token;

    let response = "";
    try {
      response = await axios.get("http://localhost:8080/api/v1/services", {
        headers: { Authorization: "Bearer " + token },
      });
      const responseData = await response.data;

      const requests = [];

      for (const key in responseData) {
        const request = {
          id: responseData[key]._id,
          requestorName: responseData[key].requestorName,
          requestedBy: responseData[key].careseeker,
          serviceType: responseData[key].serviceType,
          serviceOf: responseData[key].serviceOf,
          status: responseData[key].status,
          pickUpDate: responseData[key].pickUpDate,
          dropOffDate: responseData[key].dropOffDate,
          khaltiData: responseData[key].khaltiData,
          caretaker: responseData[key].caretaker,
        };
        requests.push(request);
      }

      context.commit("setServiceRequests", requests);
    } catch (error) {
      console.log(error);
      // context.rootState.error = error.response.data.message;
    }
  },
  async getAcceptedRequests(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/services/acceptedrequests",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data;

      const requests = [];

      for (const key in responseData) {
        const request = {
          id: responseData[key]._id,
          requestorName: responseData[key].requestorName,
          requestedBy: responseData[key].careseeker,
          serviceType: responseData[key].serviceType,
          serviceOf: responseData[key].serviceOf,
          status: responseData[key].status,

          pickUpDate: responseData[key].pickUpDate,
          dropOffDate: responseData[key].dropOffDate,
          khaltiData: responseData[key].khaltiData,
          caretaker: responseData[key].caretaker,

        };
        requests.push(request);
      }
      context.commit("setServiceRequests", requests);
    } catch (error) {
      console.log(error);
      // context.rootState.error = error.response.data.message;
    }
  },
  async getRejectedRequests(context) {
    const token = context.rootGetters.token;
    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/services/rejectedrequests",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data;

      const requests = [];

      for (const key in responseData) {
        const request = {
          id: responseData[key]._id,
          requestorName: responseData[key].requestorName,
          requestedBy: responseData[key].careseeker,
          serviceType: responseData[key].serviceType,
          serviceOf: responseData[key].serviceOf,
          status: responseData[key].status,

          pickUpDate: responseData[key].pickUpDate,
          dropOffDate: responseData[key].dropOffDate,
          khaltiData: responseData[key].khaltiData,
          caretaker: responseData[key].caretaker,

        };
        requests.push(request);
      }
      context.commit("setServiceRequests", requests);
    } catch (error) {
      console.log(error);
      context.rootState.error = error.response.data.message;
    }
  },

  async rejectRequest(context, payload) {
    const token = context.rootGetters.token;
    const serviceId = payload.id;
    //yo id bata state ko request find garera
    //tesko status update garaidiney
    //auto hatxa ani

    /* const response = await axios.patch(
      `http://localhost:8080/api/v1/services/${serviceId}/reject`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ); */
    let response = "";
    try {
      response = await axios({
        method: "patch",
        url: `http://localhost:8080/api/v1/services/${serviceId}/reject`,
        headers: { Authorization: "Bearer " + token },
      });
      let requests = context.state.requests;
      /* console.log(requests, "........................");
      // console.log(serviceId, "serviceId.................");
      // console.log(requests, "requests.................");

      let updatedRequest = requests.map(modify);
      function modify(item) {
        if (item.id == serviceId) {
          item.status = "rejected";
          return item;
        }
        return item;
      } */

      const updatedRequests = requests.filter(
        (request) => request.id != serviceId
      );

      // console.log(updatedRequest, "updatedRequest---------------------");
      context.commit("setServiceRequests", updatedRequests);
      context.rootState.success = "Rejected Request successfully.";
    } catch (error) {
      console.log(error);
      context.rootState.error = error.response.data.message;
    }
  },

  async acceptRequest(context, payload) {
    const token = context.rootGetters.token;
    const serviceId = payload.id;

    /* const response = await axios.patch(
      `http://localhost:8080/api/v1/services/${serviceId}/accept`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ); */
    let response = "";
    try {
      response = await axios({
        method: "patch",
        url: `http://localhost:8080/api/v1/services/${serviceId}/accept`,
        headers: { Authorization: "Bearer " + token },
      });
      let requests = context.state.requests;

      const updatedRequests = requests.filter(
        (request) => request.id != serviceId
      );
      context.commit("setServiceRequests", updatedRequests);

      context.rootState.success = "Accepted Request successfully.";
    } catch (error) {
      console.log(error);
      context.rootState.error = error.response.data.message;
    }
  },

  async getMyRequestsAsCareseeker(context) {
    const token = context.rootGetters.token;

    console.log("token", token);

    let response = "";
    try {
      response = await axios.get(
        "http://localhost:8080/api/v1/services/careseekerRequests",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.data;

      const requests = [];

      for (const key in responseData) {
        const request = {
          id: responseData[key]._id,
          requestorName: responseData[key].requestorName,
          requestedBy: responseData[key].careseeker,
          serviceType: responseData[key].serviceType,
          serviceOf: responseData[key].serviceOf,
          status: responseData[key].status,

          pickUpDate: responseData[key].pickUpDate,
          dropOffDate: responseData[key].dropOffDate,
          khaltiData: responseData[key].khaltiData,
          caretaker: responseData[key].caretaker,
        };
        requests.push(request);
      }
      context.commit("setServiceRequests", requests);
    } catch (error) {
      console.log("ERROR::", error?.response?.data);
    }
  },
};

