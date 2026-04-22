<template>
  <div class="find-caretaker-container">
    <!-- Header Section -->
    <div class="header">
      <router-link to="myservices">
        <button type="button" class="primary-button" v-if="isCaretaker">
          My Services
        </button>
        <button type="button" class="primary-button" v-else>My Requests</button>
      </router-link>
    </div>

    <div :class="{ 'disabled-blur': isCaretaker }">
      <h2 class="title">Find Your Suitable Sitter</h2>
      <!-- Services Selection Section -->
      <div class="services-panel">
        <!-- Overnight Services -->
        <div class="service-category">
          <h3 class="category-title">Overnight Service</h3>
          <button
            type="button"
            @click="handleOvernightServices"
            class="service-button"
            :class="{ active: overnightServices }"
          >
            <svg
              class="icon"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              ></path>
            </svg>
            <span>Pet Boarding</span>
          </button>
        </div>

        <!-- Daytime Services -->
        <div class="service-category">
          <h3 class="category-title">Daytime Service</h3>
          <div class="service-buttons">
            <button
              type="button"
              @click="handleDayCareServices"
              class="service-button"
              :class="{
                active: daytimeServices && serviceValue === 'Day Care',
              }"
            >
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                ></path>
              </svg>
              <span>Day Care</span>
            </button>

            <button
              type="button"
              @click="handleHouseVisitServices"
              class="service-button"
              :class="{
                active: daytimeServices && serviceValue === 'House Visit',
              }"
            >
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                ></path>
              </svg>
              <span>House Visit</span>
            </button>

            <button
              type="button"
              @click="handlePetWalkingServices"
              class="service-button"
              :class="{ active: petWalking }"
            >
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                ></path>
              </svg>
              <span>Pet Walking</span>
            </button>

            <button
              type="button"
              @click="handleDogTrainingServices"
              class="service-button"
              :class="{ active: dogTraining }"
            >
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                ></path>
              </svg>
              <span>Dog Training</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Form Section -->
      <div class="search-form">
        <!-- Overnight Services Form -->
        <div v-if="overnightServices" class="form-container">
          <h3 class="form-title">{{ serviceValue }}</h3>

          <div class="form-grid">
            <div class="form-group">
              <label for="location">Location</label>
              <select id="location" v-model="location" @change="getNearByplacesandCaretaker">
                <option disabled value="">Select Area</option>
                <option
                  v-for="(index, value) in kathmanduPlaces"
                  :key="index"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="pets">Select Your Pet</label>
              <select name="pets" id="pets" v-model="pet">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="fish">Fish</option>
              </select>
            </div>

            <div class="form-group">
              <label for="pickUp">Pick Up Date</label>
              <input
                type="date"
                name="pickUp"
                id="pickUp"
                v-model="pickUpDate"
                :min="minDate"
                @change="updateDropOffMin"
              />
            </div>

            <div class="form-group">
              <label for="dropOff">Drop Off Date</label>
              <input
                type="date"
                name="dropOff"
                id="dropOff"
                v-model="dropOffDate"
                :min="dropOffMinDate"
              />
            </div>
          </div>

          <button class="search-button" @click="handleSearch">Search</button>
        </div>

        <!-- Daytime Services Form -->
        <div v-if="daytimeServices" class="form-container">
          <h3 class="form-title">{{ serviceValue }}</h3>

          <div class="form-grid">
            <div class="form-group">
              <label for="location">Location</label>
              <select id="location" v-model="location" @change="getNearByplacesandCaretaker">
                <option disabled value="">Select Area</option>
                <option v-for="place in Object.keys(kathmanduPlaces).sort()" :key="place" :value="place">
  {{ place }}
</option>
              </select>
            </div>

            <div class="form-group">
              <label for="pets">Select Your Pet</label>
              <select name="pets" id="pets" v-model="pet">
                <option value="dog">Dog</option>
                <option v-if="!dogTraining" value="cat">Cat</option>
                <option v-if="!petWalking && !dogTraining" value="fish">
                  Fish
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="pickUp">Service Date</label>
              <input
                type="date"
                name="pickUp"
                id="pickUp"
                v-model="pickUpDate"
                :min="minDate"
              />
            </div>
          </div>

          <button class="search-button" @click="handleSearch">Search</button>
        </div>
      </div>

      <!-- Results Section -->
       <h1 v-if="startSearch" class="title">
        Available Caretakers
        </h1>
      <div
        v-if="startSearch && matchingCaretakers.length === 0"
        class="no-results-alert"
      >
        Sorry, we don't have any caretakers for that area for the required pet.
      </div>

      <div v-else-if="startSearch" class="results-container">
        <div v-for="people in matchingCaretakers" :key="people.profileId">
          <searched-caretaker
            @send-request="sendRequest"
            :id="people.profileId"
            :imageUrl="people.profileImageUrl"
            :Name="people.name"
            :speciality="people.speciality"
            :rate="people.rate"
            :location="people.location"
            :bio="people.bio"
            :contact="people.contact"
            :averateRating="people.averateRating"
            :totalRatings="people.totalRatings"
          ></searched-caretaker>
        </div>
      </div>

      <!-- Results Section -->
      <h1 v-if="startSearch" class="title">
        Near By {{ location }} Caretakers
        </h1>
      <div
        v-if="startSearch && nearByCaretakers.length === 0"
        class="no-results-alert"
      >
        Sorry, we don't have any caretakers near that area for the required pet.
      </div>

      <div v-else-if="startSearch" class="results-container">
        <div v-for="people in nearByCaretakers" :key="people.profileId">
          <searched-caretaker
            @send-request="sendRequest"
            :id="people.profileId"
            :imageUrl="people.profileImageUrl"
            :Name="people.name"
            :speciality="people.speciality"
            :rate="people.rate"
            :location="people.location"
            :bio="people.bio"
            :contact="people.contact"
            :averateRating="people.averateRating"
            :totalRatings="people.totalRatings"
          ></searched-caretaker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { kathmanduPlaces } from "../../constants/places";
import SearchedCaretaker from "../functionalities/SearchedCaretaker.vue";

export default {
  components: {
    SearchedCaretaker,
  },

  data() {
    return {
      receiversId: "",
      startSearch: false,
      petWalking: false,
      dogTraining: false,
      overnightServices: true,
      daytimeServices: false,
      nearByplaces: [],
      nearByCaretakers: [],
      location: "",
      pet: "dog",
      pickUpDate: "",
      dropOffDate: "",
      serviceValue: "Pet Boarding",
      minDate: "",
      dropOffMinDate: "",
    };
  },

  computed: {
    matchingCaretakers() {
      const caretakers = this.$store.getters["caretakers/caretakers"];
      return caretakers.filter((caretaker) => {
        return (
          this.pet === caretaker.speciality &&
          this.location === caretaker.location
        );
      });
    },
    kathmanduPlaces() {
      return kathmanduPlaces;
    },

    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
  },

  created() {
    this.setMinDateToday();
  },

  mounted() {
    this.loadCaretakers();
  },

  methods: {
    getNearByplacesandCaretaker() {
        this.nearByplaces = kathmanduPlaces[this.location] || [];

        const caretakers = this.$store.getters["caretakers/caretakers"];

        this.nearByCaretakers = caretakers.filter((caretaker) => {
          return kathmanduPlaces[this.location].includes(caretaker.location);
        });
    },
    setMinDateToday() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.minDate = `${year}-${month}-${day}`;
      this.dropOffMinDate = this.minDate;
    },

    updateDropOffMin() {
      if (this.pickUpDate) {
        this.dropOffMinDate = this.pickUpDate;
        if (this.dropOffDate && this.dropOffDate < this.dropOffMinDate) {
          this.dropOffDate = this.dropOffMinDate;
        }
      } else {
        this.dropOffMinDate = this.minDate;
      }
    },

    loadCaretakers() {
      this.$store.dispatch("caretakers/loadCaretakers");
    },

    sendRequest(receiversDetails) {
      this.receiversId = receiversDetails.id;
      const requestDetails = {
        receiversId: this.receiversId,
        rate: receiversDetails.rate * 100,
        serviceType: this.serviceValue,
        serviceOf: this.pet,
        pickUpDate: this.pickUpDate,
        dropOffDate: this.dropOffDate,
      };
      this.$store.dispatch("requests/contactCaretaker", requestDetails);
    },

    handleSearch() {
      if (this.location !== "") {
        this.startSearch = true;
        this.$store.dispatch("caretakers/loadCaretakers");
      }
    },

    handleOvernightServices() {
      this.startSearch = false;
      this.overnightServices = !this.overnightServices;
      if (this.overnightServices) {
        this.daytimeServices = false;
        this.petWalking = false;
        this.dogTraining = false;
        this.serviceValue = "Pet Boarding";
      } else {
        this.serviceValue = "";
      }
    },

    handleDayCareServices() {
      this.startSearch = false;
      this.overnightServices = false;
      this.petWalking = false;
      this.daytimeServices = true;
      this.serviceValue = "Day Care";
    },

    handleHouseVisitServices() {
      this.startSearch = false;
      this.overnightServices = false;
      this.petWalking = false;
      this.daytimeServices = true;
      this.serviceValue = "House Visit";
    },

    handlePetWalkingServices() {
      this.startSearch = false;
      this.overnightServices = false;
      this.daytimeServices = true;
      this.dogTraining = false;
      this.petWalking = true;
      this.serviceValue = "Pet Walking";
    },

    handleDogTrainingServices() {
      this.startSearch = false;
      this.overnightServices = false;
      this.petWalking = false;
      this.daytimeServices = true;
      this.dogTraining = true;
      this.serviceValue = "Dog Training";
    },
  },
};
</script>

<style scoped>
/* Only updating the form-grid styles to make it vertical */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Rest of your CSS remains the same */
.find-caretaker-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header Styles */
.header {
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1rem;
  color: #333;
}

.primary-button {
  background-color: #8b5cf6;
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #7c3aed;
}

.primary-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5);
}

/* Services Panel Styles */
.services-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.service-category {
  flex: 1;
  min-width: 250px;
}

.category-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4b5563;
}

.service-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.service-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  box-shadow: 3px 3px rgb(90, 151, 212);
}

.service-button:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}

.service-button.active {
  background-color: #68c5e7;
  color: white;
}

.icon {
  width: 24px;
  height: 24px;
  margin-bottom: 0.5rem;
}

/* Search Form Styles */
.search-form {
  margin-bottom: 2rem;
}

.form-container {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-button {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  background-color: #f6f3f3;
  color: #4b5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.search-button:hover {
  background-color: #68c5e7;
  color: white;
}

/* Results Styles */
.no-results-alert {
  padding: 1rem;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .services-panel {
    flex-direction: column;
  }

  .service-buttons {
    justify-content: center;
  }

  .service-button {
    min-width: 120px;
  }
}
.disabled-blur {
  filter: blur(1px);
  pointer-events: none;
  user-select: none;
}
</style>
