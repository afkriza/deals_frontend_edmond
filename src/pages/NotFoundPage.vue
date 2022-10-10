<template>
  <div :class="$style.pageContainer">
    <app-header />
    <div :class="$style.emptyState">
      <icon-not-found width="456" height="153" viewBox="0 0 456 153" />
      <h1 :class="$style.title">Page not found</h1>
      <p :class="$style.info">Looks like you got lost.</p>
    </div>
  </div>
</template>

<script>
  import IconNotFound from 'components/icons/IconNotFound';
  import AppHeader from 'components/app/AppHeader';

  export default {
    components: {
      AppHeader,
      IconNotFound
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page-container {
    display: flex;
    flex-direction: column;

    height: 100vh;
    min-width: 550px;
  }

  .empty-state {
    @include flex-center($flex-direction: column);

    flex-grow: 1;

    color: $color-text-main-lighter;
    text-align: center;
  }

  .title {
    margin: 96px 0 10px 0;
    color: $color-text-primary;
  }

  .info {
    margin: 0;
  }
</style>
