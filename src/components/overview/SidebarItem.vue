<template>
  <div>
    <h3 :class="$style.title">{{ title }}</h3>
    <div v-if="description" :class="$style.description">
      {{ description }}
    </div>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    line-height: 22px;
    color: $color-text-main;
    font-weight: bold;
    margin: 0 0 8px;
  }

  .description {
    line-height: 20px;
    color: $color-text-main-light;
    margin-bottom: 24px;
  }
</style>
