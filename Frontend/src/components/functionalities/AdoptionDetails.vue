<template>
  <base-card>
    <div id="adoptionpost">
      <header>
        <img
          :src="`http://localhost:8080/profiles/${posterImageUrl}`"
          alt="profilepic"
          class="posterImage"
        />
        <h4>{{ username }}</h4>
      </header>
    </div>
    <div id="adoptionpost">
      <p class="text-lg font-medium text-gray-900 dark:text-white">
        {{ description }}
      </p>
      <p class="text-xl font-semibold text-blue-600/75 dark:text-blue-500/75 mb-5">
        Call : {{ contact }} for more info.
      </p>

      <div class="postImageDiv">
        <img
          :src="`http://localhost:8080/uploads/${postImageUrl}`"
          alt="PostImageHere"
        />
      </div>
    </div>
  </base-card>
</template>

<script>
export default {
  props: [
    "username",
    "posterImageUrl",
    "description",
    "contact",
    "postImageUrl",
  ],
};
</script>

<style lang="scss" scoped>
#adoptionpost {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 80%;
  h4 {
    display: inline-block;
    font-size: 20px;
  }
  .posterImage {
    display: inline-block;
    margin-right: 2rem;

    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
.postImageDiv {
  height: auto;
  width: auto;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
}
</style>
