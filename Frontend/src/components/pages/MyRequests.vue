<template>
  <div>
    <base-card>
      <div>
        <div class="inline-flex ml-96 mb-4 rounded-md shadow-sm" role="group">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            @click="loadRequests"
          >
            <span v-if="isCaretaker">Received Requests</span>
            <span v-if="!isCaretaker">Sent Requests</span>
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            @click="loadAcceptedRequests"
          >
            Accepted Requests
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            @click="loadRejectedRequests"
          >
            Rejected Requests
          </button>
        </div>

        <!-- <div>
          <filter-requests @change-filter="applyFilters"></filter-requests>
        </div> -->

        <div>
          <h4
            class="text-2xl text-center text-slate-700 font-bold dark:text-white"
          >
            {{ title }}
          </h4>
        </div>
      </div>
      <div class="container" v-if="receivedRequest">
        <requests-received
          @accept-request="acceptRequest"
          @reject-request="rejectRequest"
          v-for="req in receivedRequests"
          :key="req.id"
          :id="req.id"
          :editable="isCaretaker"
          :requestorName="req.requestorName"
          :serviceType="req.serviceType"
          :serviceOf="req.serviceOf"
          :status="req.status"
          :pickUpDate="req.pickUpDate"
          :dropOffDate="req.dropOffDate"
          :paymentUrl="req.khaltiData?.payment_url"
          :payable="!isCaretaker && req.status === 'accepted'"
          :caretakerName="req.caretaker?.username"
          :complaintFiled="req.complaintFiled"
          :payoutStatus="req.payoutStatus"
          :totalAmount="req.totalAmount"
          :caretakerEarnings="req.caretakerEarnings"
        ></requests-received>
      </div>
      <div class="container" v-if="acceptedRequest">
        <requests-received
          @accept-request="acceptRequest"
          @reject-request="rejectRequest"
          v-for="req in receivedRequests"
          :key="req.id"
          :id="req.id"
          :editable="isCaretaker"
          :requestorName="req.requestorName"
          :serviceType="req.serviceType"
          :serviceOf="req.serviceOf"
          :status="req.status"
          :pickUpDate="req.pickUpDate"
          :dropOffDate="req.dropOffDate"
          :paymentUrl="req.khaltiData?.payment_url"
          :payable="!isCaretaker && req.status === 'accepted'"
          :caretakerName="req.caretaker?.username"
          :complaintFiled="req.complaintFiled"
          :payoutStatus="req.payoutStatus"
          :totalAmount="req.totalAmount"
          :caretakerEarnings="req.caretakerEarnings"
        ></requests-received>
      </div>
      <div class="container" v-if="rejectedRequest">
        <requests-received
          @accept-request="acceptRequest"
          @reject-request="rejectRequest"
          v-for="req in receivedRequests"
          :key="req.id"
          :id="req.id"
          :editable="isCaretaker"
          :requestorName="req.requestorName"
          :serviceType="req.serviceType"
          :serviceOf="req.serviceOf"
          :status="req.status"
          :pickUpDate="req.pickUpDate"
          :dropOffDate="req.dropOffDate"
          :paymentUrl="req.khaltiData?.payment_url"
          :payable="!isCaretaker && req.status === 'accepted'"
          :caretakerName="req.caretaker?.username"
          :complaintFiled="req.complaintFiled"
          :payoutStatus="req.payoutStatus"
          :totalAmount="req.totalAmount"
          :caretakerEarnings="req.caretakerEarnings"
        ></requests-received>
      </div>
    </base-card>
  </div>
</template>
<script>
import RequestsReceived from "../functionalities/RequestsReceived.vue";
import FilterRequests from "../functionalities/FilterRequests.vue";
export default {
  data() {
    return {
      activeFilters: {
        petBoarding: true,
        dayCare: true,
        houseVisit: true,
        petWalking: true,
        dogTraining: true,
      },
      receivedRequest: true,
      acceptedRequest: false,
      rejectedRequest: false,
      title: "Here are your requestes received",
    };
  },
  components: {
    RequestsReceived,
    FilterRequests,
  },

  computed: {
    receivedRequests() {
      const requests = this.$store.getters["requests/requests"];
      return requests.filter((request) => {
        if (
          this.activeFilters.petBoarding &&
          request.serviceType.includes("Pet Boarding")
        ) {
          return true;
        }
        if (
          this.activeFilters.dayCare &&
          request.serviceType.includes("Day Care")
        ) {
          return true;
        }
        if (
          this.activeFilters.houseVisit &&
          request.serviceType.includes("House Visit")
        ) {
          return true;
        }
        if (
          this.activeFilters.petWalking &&
          request.serviceType.includes("Pet Walking")
        ) {
          return true;
        }
        if (
          this.activeFilters.dogTraining &&
          request.serviceType.includes("Dog Training")
        ) {
          return true;
        }
        return false;
      });
    },
    myProfile() {
      return this.$store.getters["caretakers/myProfile"];
    },
    isLoggedIn() {
      return this.$store.getters["isLoggedIn"];
    },
    isCaretaker() {
      console.log(this.$store.getters["caretakers/isCaretaker"]);
      return this.$store.getters["caretakers/isCaretaker"];
    },
    hasProfile() {
      return this.$store.getters["caretakers/hasProfile"];
    },
    isVerified() {
      return this.$store.getters["caretakers/isVerified"];
    },
    isAdmin() {
      return this.$store.getters["isAdmin"];
    },
  },

  created() {
    this.loadRequests();
  },
  updated() {
    this.loadRequests();
  },
  methods: {
    applyFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    loadRequests() {
      
      this.title = `Here are the requests you ${
        this.isCaretaker ? "received" : "sent"
      }`;
      (this.receivedRequest = true),
        (this.acceptedRequest = false),
        (this.rejectedRequest = false),
        this.$store.dispatch("requests/getContactRequests");
    },
    acceptRequest(serviceId) {
      this.$store.dispatch("requests/acceptRequest", serviceId);
    },
    rejectRequest(serviceId) {
      this.$store.dispatch("requests/rejectRequest", serviceId);
    },
    loadAcceptedRequests() {
      this.title = this.isCaretaker ? "Here are the requests you accepted" : "Here are your requests that have been accepted";
      (this.receivedRequest = false),
        (this.acceptedRequest = true),
        (this.rejectedRequest = false),
        this.$store.dispatch("requests/getAcceptedRequests");
    },
    loadRejectedRequests() {
      this.title = this.isCaretaker ? "Here are the requests you rejected": "Here are your requests that have been rejected";
      (this.receivedRequest = false),
        (this.acceptedRequest = false),
        (this.rejectedRequest = true),
        this.$store.dispatch("requests/getRejectedRequests");
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
</style>
