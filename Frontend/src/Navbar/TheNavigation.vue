<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="container mx-auto flex items-center justify-between p-3">
      <!-- Logo Section -->
      <!-- Logo removed as requested -->

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        type="button"
        class="inline-flex items-center p-2 ml-3 text-sm text-purple-700 rounded-lg md:hidden hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>

      <!-- Navigation Links - Fixed width to prevent shifting -->
      <div 
        class="hidden w-full md:block md:w-auto ml-auto" 
        id="navbar-default" 
        :class="{ 'block': mobileMenuOpen }"
      >
        <ul class="flex flex-col md:flex-row md:space-x-8 md:font-medium md:justify-end">
          <li>
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
              exact
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/myprofile"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/myprofile' }"
            >
              My Profile
            </router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link
              to="/services"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/services' }"
            >
              Services
            </router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link
              to="/adoptme"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/adoptme' }"
            >
              Adopt Me
            </router-link>
          </li>
          <li>
            <router-link
              to="/caretakers"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/caretakers' }"
            >
              Caretakers
            </router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/login' }"
            >
              Login
            </router-link>
          </li>
          <li v-else>
            <button
              class="nav-link"
              @click="logout"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters["isLoggedIn"]
    },
    isAdmin() {
      return this.$store.getters["isAdmin"]
    },
    hasProfile() {
      return this.$store.getters["caretakers/hasProfile"]
    },
    userInitial() {
      const name = this.$store.getters?.user?.name || ''
      return name.charAt(0).toUpperCase()
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    logout() {
      this.$store.dispatch("logout")
      this.$router.replace("/")
    }
  }
}
</script>

<style scoped>
/* Fixed navbar styles */
nav {
  position: relative;
  z-index: 50;
}

/* Larger logo */
img {
  height: 96px !important;
  width: auto;
}

/* Navigation link styling */
.nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #6d28d9;
  border-radius: 0.375rem;
  transition-property: color, background-color;
  transition-duration: 200ms;
}

.nav-link:hover {
  background-color: #f5f3ff;
  color: #4c1d95;
}

.nav-link-active {
  background-color: #f5f3ff;
  color: #4c1d95;
  font-weight: 500;
}

@media (min-width: 768px) {
  .nav-link {
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }
  
  .nav-link-active {
    background-color: transparent;
    color: #4c1d95;
    border-bottom: 2px solid #6d28d9;
    border-radius: 0;
  }
  
  #navbar-default ul {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    min-width: max-content; /* Prevents shifting */
  }
}

/* Mobile menu styles */
@media (max-width: 768px) {
  #navbar-default {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 50;
    padding: 1rem;
  }
  
  #navbar-default ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>