<template>
  <base-card>
    <h3
      class="text-3xl text-center mb-10 text-slate-700 font-bold dark:text-white"
    >
      Users of Fur Fam
    </h3>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <!-- <th scope="col" class="px-6 py-3">Id</th> -->
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Role</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in loadUsers"
            :key="user.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ user.name }}
            </th>
            <!-- <td class="px-6 py-4">{{ user.id }}</td> -->
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.role }}</td>
            <td class="px-6 py-4">
              <button
                type="button"
                class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                @click="deleteUser(user.id, user)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </base-card>
</template>

<script>
export default {
  computed: {
    loadUsers() {
      return this.$store.getters["admins/getUsers"];
    },
  },
  created() {
    this.getUsers();
    // Clear any sample data when the component is created
    this.clearSampleData();
  },
  methods: {
    getUsers() {
      this.$store.dispatch("admins/loadAllUsers");
    },
    deleteUser(id, user) {
      if (confirm(`Delete user ${id} ?`) == true) {
        // Store user details before deletion
        const userDetails = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          speciality: user.speciality || (user.role === 'caretaker' ? 'Pet Care' : '')
        };
        
        // Delete the user
        this.$store.dispatch("admins/deleteUser", id).then(() => {
          // After successful deletion, log the activity
          this.logUserDeletion(userDetails);
          alert("User Deleted");
        }).catch(error => {
          console.error("Error deleting user:", error);
          alert("Error deleting user");
        });
      } else {
        alert("You cancelled the deletion");
      }
    },
    
    logUserDeletion(user) {
      // Create activity record
      const activity = {
        type: 'delete',
        timestamp: new Date().getTime(),
        user: {
          name: user.name,
          email: user.email,
          speciality: user.speciality
        }
      };
      
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
      
      // Dispatch custom event for real-time updates
      const event = new CustomEvent('userDeleted', { 
        detail: user
      });
      document.dispatchEvent(event);
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
/* Add your custom styles here if needed */
</style>