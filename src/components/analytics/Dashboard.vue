<template>
  <div :class="$style.dashboard">
    <h2>{{ dashboard.name }}</h2>
  </div>
</template>

<script>
  export default {
    props: {
      dashboard: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';
</style>
