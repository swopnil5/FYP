<template>
  <div class="login-page">
    <div class="background-container">
      <div class="background-overlay"></div>
    </div>
    
    <div class="form-container">
      <div class="form-box">
        <form class="space-y-6" @submit.prevent="submitForm">
          <h5 class="text-xl font-medium text-gray-900">
            Welcome Back
          </h5>
          <p class="text-sm text-gray-600 mb-6">Sign in to continue to your pet care platform</p>
          
          <!-- Email Field -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
              Your email
            </label>
            <input type="email" name="email" id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              placeholder="name@gmail.com" v-model.trim="email" required />
            <p v-if="emailError" class="text-sm text-red-600 mt-1">{{ emailError }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
              Your password
            </label>
            <input type="password" name="password" id="password" placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              v-model.trim="password" required />
            <div class="flex justify-end mt-1">
              <router-link to="/forgot-password" class="text-xs text-purple-600 hover:underline">
                Forgot password?
              </router-link>
            </div>
            <p v-if="passwordError" class="text-sm text-red-600 mt-1">{{ passwordError }}</p>
          </div>

          <!-- Submit Button -->
          <button type="submit"
            class="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200">
            Login to your account
          </button>

          <!-- Toast Notification -->
          <transition name="toast">
            <div v-if="showToast"
              class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-red-600 text-white rounded-xl shadow-2xl flex items-center space-x-3 min-w-[300px] justify-center border border-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">{{ toastMessage }}</span>
            </div>
          </transition>

          <div class="text-sm font-medium text-gray-600 text-center mt-4">
            Not registered?
            <router-link to="/register" class="text-purple-600 hover:underline font-semibold">
              Create account
            </router-link>
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
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      showToast: false,
      toastMessage: "",
    };
  },
  methods: {
    validateForm() {
      this.emailError = "";
      this.passwordError = "";

      let valid = true;

      if (!this.email.includes("@") || this.email.length < 5) {
        this.emailError = "Please enter a valid email address.";
        valid = false;
      }

      if (this.password.length < 6) {
        this.passwordError = "Password must be at least 6 characters.";
        valid = false;
      }

      return valid;
    },

    async submitForm() {
      if (!this.validateForm()) return;

      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
        this.$store.dispatch("getAdmins");
      } catch (error) {
        this.showToastMessage("Invalid email or password.");
      }
    },

    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 4000);
    },
  },
};
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80');
  background-size: cover;
  background-position: center;
  z-index: -2;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  z-index: -1;
}

.form-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  z-index: 1;
}

.form-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.form-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  transform: translate(-50%, -100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .form-container {
    padding: 15px;
  }
  
  .form-box {
    padding: 1.5rem;
  }
}
</style>