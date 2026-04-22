<template>
  <div class="payouts-container mt-10">
    <base-card>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Caretaker Payout Breakdown</h2>
        <router-link to="/myprofile">
          <button class="text-sm text-purple-600 hover:text-purple-800 font-medium">← Back to Dashboard</button>
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caretaker</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings Released</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funds Held (Pending)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="breakdown.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500 italic">No payout data available</td>
            </tr>
            <tr v-for="item in breakdown" :key="item._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.caretakerName }}</div>
                    <div class="text-sm text-gray-500">{{ item.caretakerEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-green-600 font-bold font-mono">Rs. {{ item.paidAmount.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-amber-600 font-bold font-mono">Rs. {{ item.pendingAmount.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="item.pendingAmount > 0" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                  Processing Payouts
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  All Clear
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breakdown: []
    };
  },
  async mounted() {
    await this.fetchBreakdown();
  },
  methods: {
    async fetchBreakdown() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/v1/admins/payout-breakdown", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          this.breakdown = result.data;
        }
      } catch (error) {
        console.error("Error fetching payout breakdown:", error);
      }
    }
  }
};
</script>

<style scoped>
.payouts-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}
</style>
