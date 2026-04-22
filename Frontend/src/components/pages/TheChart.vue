<template>
  <base-card>
    <canvas id="myChart" width="200" height="200"></canvas>
  </base-card>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  data() {
    return {};
  },
  computed: {
    months() {
      return this.$store.getters["admins/getMonths"];
    },
    counts() {
      return this.$store.getters["admins/getCounts"];
    },
  },
  /*  watch: {
    months: (value) => {
      this.chartMonths = value;
    },
    counts: (value) => {
      this.chartCount = value;
    },
  }, */

  mounted() {
    this.loadCounts();

    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Users",
            data: this.counts,
          },
        ],
      },
    });
  },
  methods: {
    loadCounts() {
      this.$store.dispatch("admins/userCount");
    },
  },
};
</script>

<style></style>
