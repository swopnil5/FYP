<template>
  <base-card>
    <h3 class="text-3xl text-center mb-10 text-slate-700 font-bold dark:text-white">
      Caretakers of Fur Fam
    </h3>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Profile Id</th>
            <th scope="col" class="px-6 py-3">User Id</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Speciality</th>
            <th scope="col" class="px-6 py-3">Verification Status</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profile in loadProfiles" :key="profile.profileId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ profile.name }}
            </th>
            <td class="px-6 py-4">{{ profile.profileId }}</td>
            <td class="px-6 py-4">{{ profile.userId }}</td>
            <td class="px-6 py-4">{{ profile.email }}</td>
            <td class="px-6 py-4">{{ profile.speciality }}</td>
            <td class="px-6 py-4">{{ profile.verificationStatus }}</td>
            <td class="px-6 py-4">
              <button type="button" class="text-white w-full bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" @click="deleteProfile(profile.profileId, profile)">
                Delete
              </button>
              <button type="button" class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900" @click="verifyProfile(profile.profileId, profile)" v-if="profile.verificationStatus === 'pending'">
                Verify
              </button>
              <button v-if="profile.verificationAttachments && profile.verificationAttachments.length && profile?.verificationStatus === 'pending'" @click="openModal(profile.verificationAttachments)" class="text-white w-full bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
                Attachments
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </base-card>

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-5 rounded-lg shadow-lg relative w-3/4 max-w-2xl">
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">✖</button>
      <div class="flex items-center justify-between">
        <button @click="prevImage" :disabled="currentImageIndex === 0" class="text-gray-600 hover:text-gray-900">⬅</button>
        <img :src="modalImages[currentImageIndex]" class="max-w-full max-h-96 object-contain" />
        <button @click="nextImage" :disabled="currentImageIndex === modalImages.length - 1" class="text-gray-600 hover:text-gray-900">➡</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      modalImages: [],
      currentImageIndex: 0,
    };
  },
  computed: {
    loadProfiles() {
      return this.$store.getters["admins/getProfiles"];
    },
  },
  created() {
    this.getProfiles();
    // Clear any sample data when the component is created
    this.clearSampleData();
  },
  methods: {
    getProfiles() {
      this.$store.dispatch("admins/loadAllProfiles");
    },
    verifyProfile(id, profile) {
      if (confirm(`Verify profile ${id} ?`)) {
        this.$store.dispatch("admins/verifyProfile", id).then(() => {
          // After successful verification, log the activity
          this.logCaretakerVerification(profile);
          alert("Profile verified successfully");
        }).catch(error => {
          console.error("Error verifying profile:", error);
          alert("Error verifying profile");
        });
      }
    },
    deleteProfile(id, profile) {
      if (confirm(`Are you sure you want to delete profile ${id}?`)) {
        this.$store.dispatch("admins/deleteProfile", id).then(() => {
          // After successful deletion, log the activity
          this.logProfileDeletion(profile);
          alert("Profile deleted successfully");
        }).catch(error => {
          console.error("Error deleting profile:", error);
          alert("Error deleting profile");
        });
      }
    },
    openModal(attachments) {
      if (attachments && attachments.length) {
        this.modalImages = attachments.map(att => `http://localhost:8080/verificationFiles/${att.filename}`);
        this.currentImageIndex = 0;
        this.showModal = true;
      } else {
        alert("No attachments available");
      }
    },
    closeModal() {
      this.showModal = false;
    },
    prevImage() {
      if (this.currentImageIndex > 0) this.currentImageIndex--;
    },
    nextImage() {
      if (this.currentImageIndex < this.modalImages.length - 1) this.currentImageIndex++;
    },
    
    // Activity logging methods
    logProfileDeletion(profile) {
      // Create activity record for profile deletion
      const activity = {
        type: 'delete',
        timestamp: new Date().getTime(),
        user: {
          name: profile.name,
          email: profile.email,
          speciality: profile.speciality || 'Pet Care'
        }
      };
      
      // Save to localStorage
      this.saveActivityToStorage(activity);
      
      // Dispatch custom event for real-time updates
      const event = new CustomEvent('userDeleted', { 
        detail: {
          name: profile.name,
          email: profile.email,
          speciality: profile.speciality
        }
      });
      document.dispatchEvent(event);
    },
    
    logCaretakerVerification(profile) {
      // Create activity record for caretaker verification
      const activity = {
        type: 'verify',
        timestamp: new Date().getTime(),
        user: {
          name: profile.name,
          email: profile.email,
          speciality: profile.speciality || 'Pet Care'
        }
      };
      
      // Save to localStorage
      this.saveActivityToStorage(activity);
      
      // Dispatch custom event for real-time updates
      const event = new CustomEvent('caretakerVerified', { 
        detail: {
          name: profile.name,
          email: profile.email,
          speciality: profile.speciality
        }
      });
      document.dispatchEvent(event);
    },
    
    saveActivityToStorage(activity) {
      // Get existing activities
      let activities = [];
      try {
        const savedActivities = localStorage.getItem('admin-recent-activities');
        if (savedActivities) {
          activities = JSON.parse(savedActivities);
          
          // Filter out any sample data (with example.com emails)
          activities = activities.filter(act => !act.user.email.includes('example.com'));
        }
      } catch (e) {
        console.error('Error parsing saved activities', e);
      }
      
      // Add new activity at the beginning
      activities.unshift(activity);
      
      // Limit to 10 most recent activities
      if (activities.length > 10) {
        activities = activities.slice(0, 10);
      }
      
      // Save to localStorage
      localStorage.setItem('admin-recent-activities', JSON.stringify(activities));
    },
    
    clearSampleData() {
      // Get existing activities
      let activities = [];
      try {
        const savedActivities = localStorage.getItem('admin-recent-activities');
        if (savedActivities) {
          activities = JSON.parse(savedActivities);
          
          // Filter out any sample data (with example.com emails)
          const realActivities = activities.filter(activity => {
            return !activity.user.email.includes('example.com');
          });
          
          // Save the cleaned list back to localStorage
          localStorage.setItem('admin-recent-activities', JSON.stringify(realActivities));
        }
      } catch (e) {
        console.error('Error parsing saved activities', e);
      }
    }
  },
};
</script>

<style>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>