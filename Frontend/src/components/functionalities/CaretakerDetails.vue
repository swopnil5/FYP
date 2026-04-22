<template>
  <div
    class="w-96 min-w-52 mt-20 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
  >
    <!-- Top Curved Banner -->
    <div class="h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-lg"></div>
    
    <div class="flex flex-col items-center relative pb-8">
      <!-- Profile Image with Error Fallback -->
      <div class="relative -mt-12 w-24 h-24 mb-3">
        <img
          class="w-full h-full object-cover rounded-full shadow-lg border-4 border-white dark:border-gray-800"
          :src="imageSrc"
          alt="Profile Picture"
          @error="handleImageError"
        />
      </div>

      <!-- Name and Speciality -->
      <h5 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        {{ Name }}
      </h5>
      <span class="text-sm font-semibold text-green-600 dark:text-green-400">
        {{ speciality }} Specialist
      </span>

      <!-- Rating Section -->
      <div class="mt-3 flex items-center">
        <div class="flex">
          <template v-for="(star, index) in 5" :key="index">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-yellow-500"
              :class="{ 'fill-yellow-500': index < Math.floor(averateRating), 'fill-yellow-300': index === Math.floor(averateRating) && averateRating % 1 >= 0.5 }"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </template>
        </div>
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300" v-if="totalRatings>0">
          {{ averateRating }} ({{ totalRatings }} reviews)
        </span>
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300" v-else>
          No reviews yet
        </span>
      </div>

      <!-- Details Section -->
      <div class="mt-4 px-6 w-full">
        <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="font-semibold text-gray-700 dark:text-gray-300">Rate</span>
          <span class="text-gray-900 dark:text-white font-medium">
            Rs. {{ rate }}<span class="text-xs text-gray-500 ml-1">/day</span>
          </span>
        </div>
        
        <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="font-semibold text-gray-700 dark:text-gray-300">Location</span>
          <span class="text-gray-900 dark:text-white">{{ location }}</span>
        </div>
        
        <div class="py-2 border-b border-gray-200 dark:border-gray-700">
          <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio</div>
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {{ bio || "--" }}
          </p>
        </div>
        
        <div class="flex items-center justify-between py-2">
          <span class="font-semibold text-gray-700 dark:text-gray-300">Contact</span>
          <span class="text-gray-900 dark:text-white">
            {{ contact || "Not Available" }}
          </span>
        </div>
      </div>

      <!-- Message Button -->
      <div class="mt-6 flex justify-center w-full px-6">
        <router-link :to="caretakerContactLink" v-if="!isCaretaker && !isAdmin" class="w-full">
          <button
            class="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 transition-all duration-300"
          >
            <span
              class="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
            >
              Message
            </span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "id",
    "imageUrl",
    "Name",
    "speciality",
    "rate",
    "location",
    "bio",
    "contact",
    "averateRating",
    "totalRatings",
  ],
  data() {
    return {
      imageSrc: `http://localhost:8080/profiles/${this.imageUrl}`,
    };
  },
  computed: {
    caretakerContactLink() {
      return this.$route.path + "/" + this.id + "/contact"; // /caretakers/1/contact
    },
    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
    isAdmin: {
      get() {
        return this.$store.getters["isAdmin"];
      },
    },
  },
  methods: {
    handleImageError() {
      this.imageSrc =
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
    },
  },
};
</script>

<style>
/* Smooth text truncation */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>