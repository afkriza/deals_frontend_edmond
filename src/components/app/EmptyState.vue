<template>
  <div :class="[$style.container, { [$style.dark]: dark }]">
    <div :class="$style.content">
      <div v-if="$slots.image" :class="$style.image">
        <slot name="image" />
      </div>
      <p v-if="$slots.title" :class="$style.title">
        <slot name="title" />
      </p>
      <p :class="$style.text">
        <slot name="text" />
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EmptyState',
    props: {
      dark: Boolean
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dark {
    .content {
      color: $color-text-main-mild-light;
    }
  }

  .container {
    @include flex-center;

    height: 100%;
  }

  .content {
    @include flex-center($flex-direction: column);

    color: $color-text-main-light;
    text-align: center;
    line-height: 20px;
  }

  .image {
    width: 240px;
    height: 240px;
  }

  .title {
    font-weight: bold;
  }

  .text,
  .title {
    margin: 0;
  }
</style>
