<template>
  <base-card>
    <h3
      class="text-3xl text-slate-700 mb-10 text-center font-bold dark:text-white"
    >
      Received Messages
    </h3>
    <div class="request-items-container">
      <request-item
        v-for="req in receivedRequests"
        :key="req.id"
        :email="req.senderEmail"
        :message="req.message"
      ></request-item>
    </div>
  </base-card>
</template>

<script>
import RequestItem from "../functionalities/RequestItem.vue";
export default {
  components: {
    RequestItem,
  },
  created() {
    this.loadMessages();
  },
  mounted() {
    this.loadMessages();
  },
  computed: {
    receivedRequests() {
      return this.$store.getters["messages/messages"];
    },
  },
  methods: {
    loadMessages() {
      this.$store.dispatch("messages/getMessages");
    },
  },
};
</script>

<style scoped>
.request-items-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
