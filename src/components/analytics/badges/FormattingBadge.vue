<template>
  <component :is="icon" :color="color" :backgroundColor="backgroundColor" />
</template>

<script>
  export default {
    props: {
      icon: {
        type: Object,
        required: true
      },

      color: {
        type: String,
        required: true
      },

      backgroundColor: {
        type: String,
        required: true
      }
    }
  };
</script>
