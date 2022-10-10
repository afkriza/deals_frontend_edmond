<template>
  <div :class="$style.wrapper">
    <div :class="$style.container">
      <div>
        <IconLogoLogin />
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import IconLogoLogin from '@/assets/images/icons/logo-login.svg';
  export default {
    name: 'SettingsLayout',
    components: { IconLogoLogin }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include flex-center;

    width: 100%;
    min-height: 100vh;
  }

  .container {
    display: grid;

    grid-template-columns: auto minmax(auto, 360px);
    grid-column-gap: 153px;

    max-width: 810px;
  }
</style>
