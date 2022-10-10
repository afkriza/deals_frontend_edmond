<template>
  <div :class="$style.container">
    <h1 :class="$style.title">You've unsubscribed</h1>
    <p :class="$style.text">
      You have been successfully unsubscribed from our email communication.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'UnsubscribePage'
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    padding-top: 3px;
  }

  .title {
    line-height: 32px;
    margin: 0 0 32px;
    color: $color-text-primary;
  }

  .text {
    line-height: 20px;
    margin-bottom: 60px;
    color: $color-text-main;
  }
</style>
