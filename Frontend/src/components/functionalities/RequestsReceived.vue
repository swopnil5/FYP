<template>
  <div class="card">
    <div
      class="max-w-sm p-6 m-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Service Type : {{ serviceType }}
      </h5>

      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Requested By: {{ requestorName }}
      </p>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Requested To: {{ caretakerName }}
      </p>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Service Of: {{ serviceOf }}
      </p>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        PickUp Date : {{ pickUpDate }}
      </p>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Drop Off Date : {{ dropOffDate }}
      </p>
      <div>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Status :
          <span v-if="status === `accepted`" class="accepted">Accepted</span>
          <span v-if="status === `rejected`" class="rejected">Rejected</span>
          <span v-if="status === `payment-confirmed`" class="payment-confirmed"
            >Payment Complete</span
          >
        </p>
      </div>

      <div v-if="totalAmount" class="amount-breakdown mb-3">
        <p class="text-sm font-semibold text-gray-700">Payment Details:</p>
        <p class="text-xs text-gray-500">Total Paid: Rs. {{ totalAmount }}</p>
        <p v-if="isCaretaker" class="text-xs text-green-600 font-bold">Your Earnings (90%): Rs. {{ caretakerEarnings }}</p>
        <p v-if="isCaretaker" class="text-xs text-red-500">Platform Fee (10%): Rs. {{ (totalAmount * 0.1).toFixed(2) }}</p>
      </div>
      <a
        class="payButton"
        v-if="payable"
        :href="paymentUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Proceed to Payment
      </a>

      <!-- Rate Now button appears only when payment is confirmed -->
      <button
        class="rateButton"
        v-if="status === 'payment-confirmed' && !isCaretaker"
        @click="openRatingModal"
      >
        Rate Now
      </button>

      <!-- File Complaint button -->
      <button
        class="complaintButton"
        v-if="status === 'payment-confirmed' && !isCaretaker && !complaintFiled"
        @click="fileComplaint"
      >
        File Complaint
      </button>

      <p v-if="complaintFiled" class="complaint-status">
        Complaint Filed - Payout Held
      </p>

      <p v-if="payoutStatus === 'released'" class="payout-released">
        Funds Released to Caretaker
      </p>

      <div v-if="editable">
        <button
          class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
          v-if="`${status}` == 'requested'"
          @click="acceptRequest"
        >
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
          >
            Accept
          </span>
        </button>
        <button
          class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          v-if="`${status}` == 'requested'"
          @click="rejectRequest"
        >
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
          >
            Reject
          </span>
        </button>
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="modal-overlay">
      <div class="rating-modal">
        <h3 class="modal-title">Rate Your Service</h3>
        <div class="star-rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= rating }"
            @click="rating = star"
          >
            ★
          </span>
        </div>
        <textarea
          v-model="comment"
          class="comment-box"
          placeholder="Leave your feedback here..."
        ></textarea>
        <div class="modal-buttons">
          <button class="submit-button" @click="submitRating">Submit</button>
          <button class="cancel-button" @click="closeRatingModal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  emits: ["accept-request", "reject-request"],
  props: [
    "id",
    "requestorName",
    "serviceType",
    "serviceOf",
    "pickUpDate",
    "dropOffDate",
    "status",
    "editable",
    "payable",
    "paymentUrl",
    "caretakerName",
    "complaintFiled",
    "payoutStatus",
    "totalAmount",
    "caretakerEarnings",
  ],
  mounted() {
    // Check if this service has a rating when component is mounted
    if (this.status === "payment-confirmed") {
      this.getServiceRating();
    }
  },
  data() {
    return {
      serviceId: null,
      showRatingModal: false,
      rating: 0,
      comment: "",
    };
  },
  computed: {
    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
  },
  methods: {
    acceptRequest() {
      this.serviceId = {
        id: this.id,
      };
      this.$emit("accept-request", this.serviceId);
    },
    rejectRequest() {
      this.serviceId = {
        id: this.id,
      };
      this.$emit("reject-request", this.serviceId);
    },
    openRatingModal() {
      this.getServiceRating();
      this.showRatingModal = true;
    },
    closeRatingModal() {
      this.showRatingModal = false;
      this.rating = 0;
      this.comment = "";
    },
    async submitRating() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/ratings/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serviceId: this.id, // MongoDB object id
              stars: this.rating, // 1 to 5
              comment: this.comment, // Review comment
            }),
          }
        );

        if (response.ok) {
          toast.success("Rating submitted successfully!");
          this.closeRatingModal();
        } else {
          const errorData = await response.json();
          toast.error(`${errorData?.message || "Failed to submit rating."}`);
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        toast.error("An error occurred while submitting the rating.");
      }
      this.getServiceRating(); // Fetch the rating again after submission
    },
    async getServiceRating() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/ratings/byServiceId/${this.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.data) {
            this.rating = data.data.stars;
            this.comment = data.data.comment;
          }
        } else {
          const errorData = await response.json();
          toast.error(
            `${errorData.data?.message || "Failed to fetch rating."}`
          );
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        toast.error("An error occurred while fetching the rating.");
      }
    },
    async fileComplaint() {
      if (!confirm("Are you sure you want to file a complaint? This will hold the payment release to the caretaker.")) {
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/v1/services/${this.id}/complaint`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Complaint filed successfully. Admin will review.");
          this.$store.dispatch("requests/getContactRequests"); // Refresh the list
        } else {
          const errorData = await response.json();
          toast.error(`${errorData?.message || "Failed to file complaint."}`);
        }
      } catch (error) {
        console.error("Error filing complaint:", error);
        toast.error("An error occurred while filing the complaint.");
      }
    },
  },
};
</script>

<style scoped>
.card {
  min-width: 350px;
  position: relative;
}

.payButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5e338d;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  width: fit-content;
  height: 100%;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  margin-bottom: 10px;
}

.rateButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f59e0b;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.rateButton:hover {
  background-color: #d97706;
}

.accepted {
  color: white;
  padding: 2px 4px;
  border-radius: 6px;
  background-color: green;
}
.rejected {
  color: white;
  padding: 2px 4px;
  border-radius: 6px;
  background-color: red;
}
.payment-confirmed {
  color: white;
  padding: 2px 4px;
  border-radius: 6px;
  background-color: blue;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rating-modal {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.star-rating {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.star {
  font-size: 2rem;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s;
  margin: 0 5px;
}

.star.active {
  color: #f59e0b;
}

.comment-box {
  width: 100%;
  height: 120px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  margin-bottom: 20px;
  resize: none;
  font-family: inherit;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #10b981;
  color: white;
}

.submit-button:hover {
  background-color: #059669;
}

.cancel-button {
  background-color: #ef4444;
  color: white;
}

.cancel-button:hover {
  background-color: #dc2626;
}

.complaintButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ef4444;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.complaintButton:hover {
  background-color: #dc2626;
}

.complaint-status {
  color: #ef4444;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}

.payout-released {
  color: #10b981;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}
</style>
