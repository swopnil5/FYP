<template>
  <!-- <div class="card"> -->
    <a
      :href="emailLink"
      class="w-[40%] ml-[10%] block max-w-sm p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {{ email }}
      </h5>
      <p class="font-normal text-gray-700 dark:text-gray-400">
        {{ message }}
      </p>
    </a>
  <!-- </div> -->
</template>

<script>
export default {
  props: ["email", "message"],
  computed: {
    emailLink() {
      return "mailto:" + this.email;
    },
  },
};
</script>

<style scoped>

</style>
