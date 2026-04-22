<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navigation Bar -->
    <the-navigation />

    <!-- Main Content -->
    <main class="flex-1 mb-2">
      <router-view />
    </main>

    <!-- Footer -->
    <!-- <FooterComponent /> -->

    <!-- Error and Success Messages -->
    <error-message />
    <success-message />

  </div>
  
</template>
    

<script>
import ErrorMessage from "./components/functions/ErrorMessage.vue";
import TheNavigation from "./Navbar/TheNavigation.vue";
import SuccessMessage from "./components/functions/SuccessMessage.vue";
import FooterComponent from "./components/functionalities/Footer.vue";

export default {
  components: { TheNavigation, ErrorMessage, SuccessMessage, FooterComponent },
  created() {
    this.$store.dispatch("tryLogin");
  },
};
</script>


