<template>
  <div class="login-page">
    <div class="background-container">
      <div class="background-overlay"></div>
    </div>
    
    <div class="form-container">
      <div class="form-box">
        <form class="space-y-6" @submit.prevent="submitForm">
          <h5 class="text-xl font-medium text-gray-900">
            Forgot Password?
          </h5>
          <p class="text-sm text-gray-600 mb-6">Enter your email and we'll send you a link to reset your password.</p>
          
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
              Your email
            </label>
            <input type="email" name="email" id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              placeholder="name@gmail.com" v-model.trim="email" required />
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 disabled:opacity-50">
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <div v-if="message" :class="['text-sm text-center mt-4', isError ? 'text-red-600' : 'text-green-600']">
            {{ message }}
          </div>

          <div class="text-sm font-medium text-gray-600 text-center mt-4">
            Remember your password?
            <router-link to="/login" class="text-purple-600 hover:underline font-semibold">
              Back to login
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
      message: "",
      isError: false,
      isLoading: false
    };
  },
  methods: {
    async submitForm() {
      this.isLoading = true;
      this.message = "";
      try {
        const response = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: this.email })
        });
        const data = await response.json();
        if (response.ok) {
          this.message = "Reset link sent! Please check your email.";
          this.isError = false;
        } else {
          this.message = data.message || "Something went wrong.";
          this.isError = true;
        }
      } catch (error) {
        this.message = "Error connecting to server.";
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Reusing styles from TheLogin.vue for aesthetic consistency */
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
</style>
