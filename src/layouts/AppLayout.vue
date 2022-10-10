<template>
  <div
    :class="[
      $style.main,
      { [$style.fullscreen]: fullscreen, [$style.noPadding]: noPadding }
    ]"
  >
    <app-navigation v-if="isNavigationShown" :class="$style.navigation" />
    <router-view :key="$route.fullPath" :class="$style.content"></router-view>
    <LoadingView
      v-if="showLoader || showLazyLoader"
      :class="isNavigationShown && $style.partialLoader"
      :loader-message="loaderMessage"
      :transparent="showLazyLoader"
    />
    <span v-if="isAuthenticated">
      <Toast v-for="toast in toasts" :key="toast.message" :toast="toast" />
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import Navigation from 'components/app/Navigation';
  import LoadingView from 'components/app/LoadingView';
  import Toast from 'components/app/Toast';
  import { moduleNameMapping } from 'enums/pages';

  export default {
    components: {
      'app-navigation': Navigation,
      LoadingView,
      Toast
    },

    computed: {
      isNavigationShown() {
        return this.isAuthenticated && !this.fullscreen;
      },

      loaderMessage() {
        const moduleName = moduleNameMapping[this.$router.currentRoute.name];
        return moduleName && `Loading ${moduleName}...`;
      },

      ...mapGetters([
        'fullscreen',
        'noPadding',
        'isAuthenticated',
        'showLoader',
        'showLazyLoader',
        'toasts'
      ])
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .main {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: $navigation-width 1fr;

    grid-template-areas: 'navigation content';

    background-color: $color-bg-light;

    min-height: 100vh;

    &.fullscreen {
      grid-template-areas: 'content content';

      min-height: 100vh;
      height: auto;

      padding-left: $navigation-width;
      padding-top: $min-filter-height;

      background-color: $color-bg-main-dimmed; // this might need to be adapted later, for now it's ok
    }

    &.no-padding {
      padding-left: 0;
      padding-top: 0;
    }
  }

  .partial-loader {
    left: $navigation-width;
  }

  .navigation {
    grid-area: navigation;
  }

  .header {
    grid-area: content;
  }

  .content {
    grid-area: content;
  }
</style>
