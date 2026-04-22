<template>
  <base-card>
    <button type="button"
      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      v-if="!showPostCreation && isCaretaker && hasProfile" @click="showPostCreation = true">
      Create a Post
    </button>
    <button type="button"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      v-if="showPostCreation" @click="showPostCreation = false">
      Cancel
    </button>
    <div v-if="isCaretaker && !hasProfile">
      You must have a profile to create a post.
    </div>

    <div class="container" v-if="showPostCreation">
      <form enctype="multipart/form-data">
        <div>
          <button type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="submitForm">
            Post
          </button>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload a
            Pic</label>
        </div>
        <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image" type="file" name="postImage" accept="image/*" @change="uploadFile" />
        <div class="mb-6">
          <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact
            Number</label>
          <input type="number" id="number" v-model.trim="phone"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div>
          <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
          <textarea id="description" rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write some info..." v-model.trim="description"></textarea>
        </div>
      </form>
    </div>

    <div>
      <p class="text-center text-gray-500 dark:text-gray-400">
        Maybe Your New Family?
      </p>

      <adoption-details v-for="post in adoptionPosts" :key="post.postId" :username="post.username"
        :posterImageUrl="post.posterImageUrl" :description="post.description" :contact="post.number"
        :postImageUrl="post.postImageUrl"></adoption-details>
    </div>
  </base-card>
</template>

<script>
import AdoptionDetails from "../functionalities/AdoptionDetails.vue";

export default {
  components: {
    AdoptionDetails,
  },
  data() {
    return {
      showPostCreation: false,
      isAdmin: true,
      postImage: null,
      phone: "",
      description: "",
      isValidForm: true,
    };
  },
  computed: {
    adoptionPosts() {
      return this.$store.getters["adoptions/posts"];
    },
    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
    hasProfile() {
      return this.$store.getters["caretakers/hasProfile"];
    }
  },

  mounted() {
    this.loadCaretakers();
    this.loadAdoptionPosts();
    
  },
  methods: {
    loadAdoptionPosts() {
      this.$store.dispatch("adoptions/loadAdoptionPosts");
    },
    loadCaretakers() {
      this.$store.dispatch("caretakers/loadCaretakers");
    },
    uploadFile(event) {
      this.postImage = event.target.files[0];
    },
    submitForm() {
      this.isValidForm = true;
      if (
        this.postImage == null ||
        this.phone === "" ||
        this.description === ""
      ) {
        this.isValidForm = false;
        return;
      }

      const formData = {
        postImage: this.postImage,
        phone: this.phone,
        description: this.description,
      };

      this.$store.dispatch("adoptions/addAdoptionPost", formData);
      this.showPostCreation = false;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 80vh;
  /* optional */
}
</style>
