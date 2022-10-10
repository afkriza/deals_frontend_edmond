<template>
  <article :class="$style.pageBackground">
    <div :class="$style.card">
      <header :class="$style.header">
        <IconLogo />
      </header>
      <login-form />
    </div>
    <Toast
      v-for="toast in toasts"
      :key="toast.message"
      :message="toast.message"
      :type="toast.type"
    />
  </article>
</template>

<script>
  import { mapGetters } from 'vuex';

  import IconLogo from '@/assets/images/icons/logo-login.svg';

  import LoginForm from 'components/forms/LoginForm';
  import Toast from 'components/app/Toast';

  export default {
    components: {
      LoginForm,
      Toast,
      IconLogo
    },

    computed: {
      ...mapGetters(['toasts'])
    },

    data() {
      return {
        loginFormModel: {}
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page-background {
    @include public-page-bg;
  }

  .card {
    @include card;
    padding: 72px 140px 48px;

    width: 560px;
  }

  .header {
    @include flex-center;

    margin-bottom: 67px;
  }
</style>
