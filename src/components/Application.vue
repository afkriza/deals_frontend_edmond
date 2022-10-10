<template>
  <div id="app" :class="isCustomScrollbarClass && 'windows-scrollbar'">
    <router-view :key="$route.fullPath" />
    <portal-target name="modals" multiple></portal-target>
  </div>
</template>

<script>
  import { isWindows } from '@/utils/browser';

  export default {
    computed: {
      isCustomScrollbarClass() {
        return isWindows;
      }
    }
  };
</script>

<style lang="scss">
  @import 'assets/stylesheets/application';

  .windows-scrollbar {
    @include scrollbar($color-macos-scrollbar, $color-bg-light);

    * {
      /* stylelint-disable-line selector-max-universal */
      @include scrollbar($color-macos-scrollbar, $color-bg-light);
    }
  }
</style>
