<template>
  <div class="register-page">
    <div class="container">
      <div
        class="form-card w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="submitForm">
          <h5 class="text-xl font-medium text-gray-900 dark:text-white">
            Join our platform
          </h5>

          <!-- Name Field -->
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
            <input type="text" name="name" id="name" v-model.trim="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Swopnil Dahal" required />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Role Selection -->
          <div>
            <div class="flex items-center mb-4">
              <input id="caretaker" type="radio" value="caretaker" v-model="role"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="caretaker" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Caretaker</label>
            </div>
            <div class="flex items-center">
              <input id="careseeker" type="radio" value="careseeker" v-model="role"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="careseeker" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Careseeker</label>
            </div>
          </div>

          <!-- Pet Selection (Visible only for Careseekers) -->
          <div v-if="role === 'careseeker'" class="pet-selection">
            <label for="pet" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Pet</label>
            <select id="pet" v-model="pet"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
              <option disabled value="">Choose a pet</option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              <option value="fish">Fish</option>
            </select>
            <p v-if="errors.pet" class="text-red-500 text-sm mt-1">{{ errors.pet }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input type="email" name="email" id="email" v-model.trim="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@gmail.com" required />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input type="password" name="password" id="password" v-model.trim="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="••••••••" required />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <!-- Submit Button -->
          <button type="submit"
            class="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
            Register
          </button>

          <!-- Login Redirect -->
          <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already registered?
            <router-link to="/login" class="text-purple-700 hover:underline dark:text-purple-500">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "careseeker", // Default role
      pet: "",
      errors: {},
    };
  },
  created() {
    // Check if role is specified in the URL query parameters
    if (this.$route.query.role) {
      // Set the role based on the URL parameter
      this.role = this.$route.query.role;
    }
  },
  methods: {
    async submitForm() {
      this.errors = {}; // Reset errors

      if (!this.name) {
        this.errors.name = "Full name is required.";
      }
      if (!this.email) {
        this.errors.email = "Email is required.";
      } else if (!this.email.includes("@")) {
        this.errors.email = "Invalid email format.";
      }
      if (!this.password) {
        this.errors.password = "Password is required.";
      } else if (this.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
      }

      if (this.role === "careseeker" && !this.pet) {
        this.errors.pet = "Please select a pet.";
      }

      // If any errors exist, stop form submission
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      // Dispatch sign-up action if validation passes
      try {
        await this.$store.dispatch("signup", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
          petType: this.role === "careseeker" ? this.pet : null,
        });
        
        this.$store.dispatch("getAdmins");
        this.$router.replace("/");
      } catch (error) {
        console.error("Signup error:", error);
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Form card with hover effect */
.form-card {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 0 auto; /* Center the form card */
  position: relative;
  left: 0;
  right: 0;
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Fix for the form height issue */
.pet-selection {
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

/* Make the form height consistent */
form {
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

/* Style the register button to match your site's purple button */
button[type="submit"] {
  background-color: #8b5cf6;
  transition: all 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
}

/* Style the login link to match your site's color scheme */
a {
  color: #8b5cf6;
  transition: color 0.2s ease;
}

a:hover {
  color: #7c3aed;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  .form-card {
    width: 90%;
    max-width: 90%;
  }
}
</style>