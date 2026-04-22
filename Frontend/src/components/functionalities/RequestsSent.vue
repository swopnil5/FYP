<template>
  <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="flex flex-col items-center p-6">
      <h5 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        {{ caretakerName }}
      </h5>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Service: {{ serviceType }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        For: {{ serviceOf }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Status: {{ status }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Dates: {{ pickUpDate }} to {{ dropOffDate }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "caretakerName", "serviceType", "serviceOf", "status", "pickUpDate", "dropOffDate"],
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>