<template>
  <base-card>
    <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">
      Filter Caretaker by the pets they specialize in.
    </h3>
    <ul
      class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <li
        class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
      >
        <div class="flex items-center pl-3">
          <input
            id="dog"
            type="checkbox"
            checked
            @change="applyFilter($event)"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="vue-checkbox-list"
            class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Dog</label
          >
        </div>
      </li>
      <li
        class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
      >
        <div class="flex items-center pl-3">
          <input
            id="cat"
            type="checkbox"
            checked
            @change="applyFilter($event)"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="react-checkbox-list"
            class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Cat</label
          >
        </div>
      </li>
      <li
        class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
      >
        <div class="flex items-center pl-3">
          <input
            id="fish"
            type="checkbox"
            checked
            @change="applyFilter($event)"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="angular-checkbox-list"
            class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Fish</label
          >
        </div>
      </li>
    </ul>
  </base-card>
</template>

<script>
export default {
  emits: ["change-filter"],
  data() {
    return {
      filters: {
        dog: true,
        cat: true,
        fish: true,
      },
    };
  },
  methods: {
    applyFilter(event) {
      const inputId = event.target.id;
      const isActive = event.target.checked;
      const updatedFilters = {
        ...this.filters,
        [inputId]: isActive,
      };
      this.filters = updatedFilters;

      this.$emit("change-filter", updatedFilters);
    },
  },
};
</script>
