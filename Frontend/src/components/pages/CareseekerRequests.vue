<template>
  <div>
    <base-card>
      <div>
        <!-- Toggle Buttons -->
        <div class="inline-flex ml-96 mb-4 rounded-md shadow-sm" role="group">
          <button @click="loadPendingRequests">Pending Requests</button>
          <button @click="loadAcceptedRequests">Accepted Requests</button>
          <button @click="loadRejectedRequests">Rejected Requests</button>
        </div>

        <!-- Requests List -->
        <div v-if="pendingRequest">
          <requests-sent
            v-for="req in sentRequests"
            :key="req.id"
            :id="req.id"
            :caretakerName="req.caretakerName"
            :serviceType="req.serviceType"
            :serviceOf="req.serviceOf"
            :status="req.status"
            :pickUpDate="req.pickUpDate"
            :dropOffDate="req.dropOffDate"
          ></requests-sent>
        </div>
        <div v-if="acceptedRequest">
          <requests-sent
            v-for="req in acceptedSentRequests"
            :key="req.id"
            :id="req.id"
            :caretakerName="req.caretakerName"
            :serviceType="req.serviceType"
            :serviceOf="req.serviceOf"
            :status="req.status"
            :pickUpDate="req.pickUpDate"
            :dropOffDate="req.dropOffDate"
          ></requests-sent>
        </div>
        <div v-if="rejectedRequest">
          <requests-sent
            v-for="req in rejectedSentRequests"
            :key="req.id"
            :id="req.id"
            :caretakerName="req.caretakerName"
            :serviceType="req.serviceType"
            :serviceOf="req.serviceOf"
            :status="req.status"
            :pickUpDate="req.pickUpDate"
            :dropOffDate="req.dropOffDate"
          ></requests-sent>
        </div>
      </div>
    </base-card>
  </div>
</template>

<script>
import RequestsSent from "../functionalities/RequestsSent.vue";

export default {
  components: {
    RequestsSent,
  },
  data() {
    return {
      pendingRequest: true,
      acceptedRequest: false,
      rejectedRequest: false,
    };
  },
  computed: {
    sentRequests() {
      console.log("State: ", ...this.$store.getters["requests/setServiceRequests"]);
      return this.$store.state;
    },
  },
  methods: {
    loadPendingRequests() {
      this.pendingRequest = true;
      this.acceptedRequest = false;
      this.rejectedRequest = false;
      this.$store.dispatch("requests/getMyRequestsAsCareseeker");
    },
  },
  created() {
    this.loadPendingRequests(); // Load pending requests by default
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
