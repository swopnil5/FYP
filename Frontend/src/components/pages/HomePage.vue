<template>
  <base-card>
    <the-carousel></the-carousel>
  </base-card>
</template>

<script>
import TheCarousel from "../functionalities/TheCarousel.vue";
export default {
  components: {
    TheCarousel,
  },
};
</script>

<style scoped>
.align-items {
  height: 650px;
}
</style> 
