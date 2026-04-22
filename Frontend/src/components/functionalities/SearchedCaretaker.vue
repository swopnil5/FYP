<template>
  <div
    class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group"
  >
    <!-- Profile Image with Error Fallback -->
    <div class="flex justify-center pt-6">
      <div class="relative w-32 h-32">
        <img
          class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
          :src="imageSrc"
          alt="Profile Picture"
          @error="handleImageError"
        />
        <div
          class="absolute inset-0 bg-gradient-to-br rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        ></div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="px-6 py-4">
      <div class="text-center mb-2">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ Name }}
        </h3>
        <span class="text-sm font-semibold text-green-600 dark:text-blue-400">
          {{ speciality }} Specialist
        </span>
      </div>
      
      <!-- Rating Section -->
      <div class="flex justify-center items-center mt-2 mb-4">
        <div class="flex">
          <template v-for="i in 5" :key="i">
            <StarIcon
              :class="[
                'h-5 w-5',
                i <= Math.floor(averateRating) ? 'text-yellow-400 fill-yellow-400' : 
                (i === Math.ceil(averateRating) && averateRating % 1 > 0) ? 'text-yellow-400 fill-yellow-200' : 
                'text-yellow-400 fill-transparent'
              ]"
            />
          </template>
        </div>
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300" v-if="totalRatings">
          {{ averateRating }} ({{ totalRatings }})
        </span>
        <span class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400" v-else>
          No ratings yet
        </span>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <CurrencyDollarIcon class="h-5 w-5 text-green-500" />
          <span class="text-gray-600 dark:text-gray-300">
            ${{ rate }}<span class="text-xs text-gray-400">/day</span>
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <MapPinIcon class="h-5 w-5 text-red-500" />
          <span class="text-gray-600 dark:text-gray-300 truncate">{{
            location
          }}</span>
        </div>
      </div>

      <!-- Bio Section -->
      <div class="mt-4">
        <p class="text-gray-700 dark:text-gray-400 text-sm line-clamp-3">
          {{ bio || "--" }}
        </p>
      </div>

      <!-- Phone Number for contact -->
      <div class="mt-4">
        <span>Phone: </span>
        <p class="text-gray-700 dark:text-gray-400 text-sm line-clamp-3">
          {{ contact || "Contact Number" }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="mt-6 mb-4">
        <button
          v-if="!isCaretaker"
          @click="sendRequest"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/20"
        >
          Request Service
          <ArrowRightIcon class="h-4 w-4 inline-block ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowRightIcon,
  StarIcon
} from "@heroicons/vue/24/outline";

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
  emits: ["send-request"],
  components: { CurrencyDollarIcon, MapPinIcon, ArrowRightIcon, StarIcon },
  data() {
    return {
      imageSrc: `http://localhost:8080/profiles/${this.imageUrl}`,
      receiversDetails: null,
    };
  },
  computed: {
    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
  },
  methods: {
    handleImageError() {
      this.imageSrc =
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
    },
    sendRequest() {
      this.receiversDetails = { id: this.id, rate: this.rate };
      this.$emit("send-request", this.receiversDetails);
    },
  },
};
</script>

<style>
/* Custom gradient overlay animation */
.group:hover .gradient-overlay {
  opacity: 0.2;
}

/* Smooth text truncation */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>