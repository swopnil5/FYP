<template>
  <base-card>
    <div class="message-form">
      <h3
        class="text-3xl text-slate-500 mb-10 text-center font-bold dark:text-white"
      >
        Send Message?
      </h3>
      <hr
        class="w-48 h-1 mx-auto my-4 bg-gray-200 border-0 rounded md:my-10 dark:bg-gray-700"
      />
      <form @submit.prevent>
        <div>
          <label
            for="input-group-1"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Your Email</label
          >
          <div class="relative mb-6">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                ></path>
                <path
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                ></path>
              </svg>
            </div>

            <input
              type="text"
              id="input-group-1"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
              required
              v-model.trim="email"
            />
          </div>
        </div>
        <div>
          <label
            for="message"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Your message</label
          >
          <textarea
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your message here..."
            required
            v-model.trim="message"
          ></textarea>
        </div>
        <div
          class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
          v-if="!validForm"
        >
          Please enter a valid email and leave a message.
        </div>
        <div>
          <button
            type="button"
            class="text-white mt-6 bg-gray-400 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-400 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:border-gray-700"
            @click="submitForm"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  </base-card>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      message: "",
      validForm: true,
    };
  },
  methods: {
    submitForm() {
      this.validForm = true;
      if (
        this.email === "" ||
        !this.email.includes("@") ||
        this.message === ""
      ) {
        this.validForm = false;
        return;
      }

      this.$store.dispatch("messages/sendMessage", {
        email: this.email,
        message: this.message,
        caretakerId: this.$route.params.id,
      });
      this.$router.replace("/caretakers");
    },
  },
};
</script>

<style scoped>
.message-form {
  max-width: 60%;
  margin-left: 20%;
}
</style>
