<template>
  <base-card>
    <form @submit.prevent class="card">
      <div class="form-header">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Identity Verification</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Please upload your citizenship certificate or any government-issued ID for verification by our administrators.
        </p>
      </div>

      <div class="form-group">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="files"
        >Upload Documents</label>
        <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2.5"
          id="files"
          type="file"
          name="files"
          ref="files"
          required
          @change="uploadFiles"
          multiple
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Accepted formats: JPG, PNG, PDF (Max size: 5MB)</p>
      </div>

      <div class="form-group mt-4">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Additional Information</label>
        <textarea
          id="message"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Provide any additional information about your documents..."
          required
          v-model.trim="text"
        ></textarea>
      </div>

      <div>
        <button
          type="button"
          class="text-white mt-5 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          @click="submitForm()"
        >
          Send
        </button>
      </div>

      <div
        class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
        role="alert"
        v-if="!isValid"
      >
        Please upload your documents and provide additional information before sending.
      </div>
    </form>
  </base-card>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      text: "",
      isValid: true,
    };
  },
  methods: {
    uploadFiles() {
      const files = this.$refs.files.files;
      this.files = [...this.files, ...files];
    },
    submitForm() {
      this.isValid = true;
      if (this.files.length === 0 || this.text === "") {
        this.isValid = false;
        return;
      }
      const formData = {
        files: this.files,
        text: this.text,
      };

      this.$store.dispatch("caretakers/sendVerificationRequest", formData);
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 60%;
  margin-left: 20%;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .card {
    max-width: 90%;
    margin-left: 5%;
    padding: 1rem;
  }
}
</style>