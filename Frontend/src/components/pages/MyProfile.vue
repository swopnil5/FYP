<template>
  <base-card>
    <!-- For non-admin users -->
    <div v-if="!isAdmin">
      <!-- Caretaker without profile -->
      <div v-if="!hasProfile && isCaretaker">
        <profile-creation @save-data="saveData"></profile-creation>
      </div>

      <!-- Careseeker view -->
      <div v-if="!hasProfile && !isCaretaker">
        <p class="mb-3 text-gray-500 dark:text-gray-400">
          Only caretakers and admins have access to this page. Please redirect to
          <router-link to="caretakers"
            class="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">Caretakers</router-link>
          page to know our professionals.
        </p>
      </div>

      <!-- Caretaker with profile -->
      <div v-if="hasProfile && isCaretaker" class="divide-button">
        <div v-for="profile in myProfile" :key="profile.profileId" style="padding: 0;">
          <profile-details :id="profile.profileId" :username="profile.username" :imageUrl="profile.imageUrl"
            :email="profile.email" :Name="profile.name" :speciality="profile.speciality" :rate="profile.rate"
            :contact="profile.contact" :location="profile.location" :bio="profile.bio"
            :verificationStatus="profile.verificationStatus"
            :totalEarnings="profile.totalEarnings"
            :pendingEarnings="profile.pendingEarnings">
          </profile-details>
          <router-link to="/applyforverification" v-if="!isVerified">
            <button type="button"
              class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
              Apply For Verification
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard View - ONLY THIS SECTION SHOWS FOR ADMINS -->
    <div v-if="isAdmin" class="admin-dashboard">
      <div class="admin-header">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <p class="text-gray-600 mb-8">Welcome to your admin control panel. Manage users, view statistics, and monitor platform activity.</p>
      </div>
      
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Total Users</h3>
            <p class="text-3xl font-bold text-purple-600">{{ totalUsers }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Caretaker Profiles</h3>
            <p class="text-3xl font-bold text-purple-600">{{ totalProfiles }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Verified Caretakers</h3>
            <p class="text-3xl font-bold text-purple-600">{{ verifiedCaretakers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold text-gray-700">Earnings & Payouts</h3>
            <div class="mt-2 space-y-1">
              <p class="text-xl font-bold text-green-600">Collected: Rs. {{ adminEarnings.collectedFees?.toFixed(2) || 0 }}</p>
              <p class="text-sm font-medium text-amber-600">Pending Fees: Rs. {{ adminEarnings.pendingFees?.toFixed(2) || 0 }}</p>
              <p class="text-sm font-medium text-blue-600">Pending Payouts: Rs. {{ adminEarnings.pendingPayouts?.toFixed(2) || 0 }}</p>
              <p class="text-xs text-gray-500 mt-2">Circulating: Rs. {{ adminEarnings.totalRevenue?.toFixed(2) || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="admin-actions">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Administrative Actions</h3>
        <div class="admin-buttons">
          <router-link to="/allusers">
            <button type="button" class="admin-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              All Users
            </button>
          </router-link>
          
          <router-link to="/chart">
            <button type="button" class="admin-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Users Chart
            </button>
          </router-link>
          
          <router-link to="/allprofiles">
            <button type="button" class="admin-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All Profiles
            </button>
          </router-link>

          <router-link to="/payouts">
            <button type="button" class="admin-button bg-amber-600 hover:bg-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Payout Breakdown
            </button>
          </router-link>
        </div>
      </div>
      
      <div class="admin-recent">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div class="recent-activity">
          <div v-if="recentActivities.length === 0" class="text-gray-500 italic">No recent activities to display</div>
          <div v-else class="activity-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                <svg v-if="activity.type === 'delete'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <svg v-else-if="activity.type === 'verify'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-action">{{ getActivityText(activity) }}</span>
                  <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                </div>
                <div class="activity-details">
                  <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">{{ activity.user.name }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ activity.user.email }}</span>
                  </div>
                  <div v-if="activity.user.speciality" class="detail-item">
                    <span class="detail-label">Speciality:</span>
                    <span class="detail-value">{{ activity.user.speciality }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script>
import ProfileDetails from "../functionalities/ProfileDetails.vue";
import ProfileCreation from "../functionalities/ProfileCreation.vue";
export default {
  data() {
    return {
      recentActivities: [],
      adminEarnings: {
        totalRevenue: 0,
        totalCommission: 0
      }
    };
  },
  components: { ProfileDetails, ProfileCreation },
  beforeMount() {
    if (!this.isAdmin) {
      this.loadAllCaretakers();
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.loadCaretakers();
    } else {
      // For admin dashboard, load all necessary data
      this.loadAllUsers();
      this.loadAllCaretakers();
      this.loadRecentActivities();
      this.fetchAdminEarnings();
      
      // Set up event listeners for real-time updates
      document.addEventListener('userDeleted', this.handleUserDeleted);
      document.addEventListener('caretakerVerified', this.handleCaretakerVerified);
    }
    this.loadAdmins();
  },
  beforeDestroy() {
    // Clean up event listeners
    if (this.isAdmin) {
      document.removeEventListener('userDeleted', this.handleUserDeleted);
      document.removeEventListener('caretakerVerified', this.handleCaretakerVerified);
    }
  },
  computed: {
    myProfile() {
      return this.$store.getters["caretakers/myProfile"];
    },
    isLoggedIn() {
      return this.$store.getters["isLoggedIn"];
    },
    isCaretaker() {
      return this.$store.getters["caretakers/isCaretaker"];
    },
    hasProfile() {
      return this.$store.getters["caretakers/hasProfile"];
    },
    isVerified() {
      return this.$store.getters["caretakers/isVerified"];
    },
    isAdmin() {
      return this.$store.getters["isAdmin"];
    },
    // Get real-time statistics from the store
    totalUsers() {
      // Get all users from the admins module and exclude admin users
      const allUsers = this.$store.getters["admins/getUsers"] || [];
      // Filter out users with admin role
      return allUsers.filter(user => !this.isUserAdmin(user)).length || 0;
    },
    totalProfiles() {
      // Count users with role "caretaker" but exclude admins
      const caretakers = this.$store.getters["caretakers/caretakers"] || [];
      return caretakers.filter(caretaker => !this.isUserAdmin(caretaker)).length || 0;
    },
    verifiedCaretakers() {
      // Count verified caretakers but exclude admins
      const caretakers = this.$store.getters["caretakers/caretakers"] || [];
      return caretakers.filter(caretaker => 
        caretaker.verificationStatus === "verified" && !this.isUserAdmin(caretaker)
      ).length || 0;
    }
  },
  methods: {
    loadCaretakers() {
      this.$store.dispatch("caretakers/getMyProfile");
    },
    loadAdmins() {
      this.$store.dispatch("getAdmins");
    },
    loadAllCaretakers() {
      this.$store.dispatch("caretakers/loadCaretakers");
    },
    loadAllUsers() {
      // Use the same action that the All Users page uses
      this.$store.dispatch("admins/loadAllUsers");
    },
    saveData(formData) {
      this.$store.dispatch("caretakers/addProfile", formData);
    },
    // Helper method to check if a user is an admin
    isUserAdmin(user) {
      // Check if user has admin role or isAdmin flag
      // Adjust this based on how admins are identified in your system
      return user && (user.role === 'admin' || user.isAdmin === true || user.name === 'Admin');
    },
    
    // Recent Activity Methods
    loadRecentActivities() {
      // Load activities from localStorage
      const savedActivities = localStorage.getItem('admin-recent-activities');
      if (savedActivities) {
        try {
          this.recentActivities = JSON.parse(savedActivities);
        } catch (e) {
          console.error('Error parsing saved activities', e);
          this.recentActivities = [];
        }
      }
    },
    
    // Event handlers for admin actions
    handleUserDeleted(event) {
      console.log('User deleted event received:', event.detail);
      
      // Force refresh data
      this.loadAllUsers();
      
      // Refresh activities from localStorage
      this.loadRecentActivities();
    },
    
    handleCaretakerVerified(event) {
      console.log('Caretaker verified event received:', event.detail);
      
      // Force refresh data
      this.loadAllCaretakers();
      
      // Refresh activities from localStorage
      this.loadRecentActivities();
    },
    
    // Helper methods for displaying activities
    getActivityText(activity) {
      switch (activity.type) {
        case 'delete':
          return 'User Deleted';
        case 'verify':
          return 'Caretaker Verified';
        default:
          return 'Action Performed';
      }
    },
    
    getActivityIconClass(type) {
      switch (type) {
        case 'delete':
          return 'bg-red-100 text-red-600';
        case 'verify':
          return 'bg-green-100 text-green-600';
        default:
          return 'bg-blue-100 text-blue-600';
      }
    },
    
    formatTime(timestamp) {
      const now = new Date();
      const activityTime = new Date(timestamp);
      
      // If it's today, show the time
      if (activityTime.toDateString() === now.toDateString()) {
        return activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If it's yesterday, show "Yesterday"
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (activityTime.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // Otherwise show the date
      return activityTime.toLocaleDateString();
    },
    
    async fetchAdminEarnings() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/v1/admins/earnings", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          this.adminEarnings = result.data;
        }
      } catch (error) {
        console.error("Error fetching admin earnings:", error);
      }
    }
  },
};
</script>

<style scoped>
.card {
  max-width: 90%;
}

.profileCreationForm {
  .card {
    max-width: 50%;
  }
}

/* Admin Dashboard Styles */
.admin-dashboard {
  padding: 1rem;
}

.admin-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  background-color: #f3f4f6;
  border-radius: 9999px;
  padding: 0.75rem;
  margin-right: 1rem;
  color: #8b5cf6;
}

.admin-actions {
  margin-bottom: 2rem;
}

.admin-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8b5cf6;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.admin-button:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);
}

.admin-recent {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

/* Recent Activity Styles */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border-left: 4px solid #8b5cf6;
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-action {
  font-weight: 600;
  color: #4b5563;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item {
  display: flex;
  font-size: 0.875rem;
}

.detail-label {
  font-weight: 500;
  color: #4b5563;
  width: 5rem;
}

.detail-value {
  color: #6b7280;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-buttons {
    flex-direction: column;
  }
  
  .admin-button {
    width: 100%;
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .activity-time {
    margin-top: 0.25rem;
  }
}
</style>