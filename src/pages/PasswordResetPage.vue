<template>
  <div>
    <article v-if="!hasErrors" :class="$style.resetPage">
      <div :class="$style.card">
        <header :class="$style.header">
          <IconLogoLogin />
        </header>

        <div :class="$style.formContainer">
          <template v-if="!passwordHasBeenReset">
            <h1 :class="$style.formTitle">Reset password</h1>
            <p :class="$style.text">
              Before you can access your account again, you must set a new
              password.
            </p>
            <password-reset-form
              :errors="errors"
              @submit="submit"
              :submitting="isLoadingPagePasswordResetRequest"
            />
          </template>
          <template v-else>
            <h1 :class="$style.title">Password reset</h1>
            <p :class="$style.redirectText">
              We will automatically redirect you the login page.
              <br />If nothing is happening, please
              <router-link :class="$style.link" to="/login"
                >click here to continue.</router-link
              >
            </p>
          </template>
        </div>
      </div>
    </article>
    <div v-else :class="$style.errorStateContainer">
      <AppEmptyState
        :class="$style.emptyState"
        :empty-state-icon="iconErrorState"
        description="Something went wrong while we were trying to reset your password. Please try again."
        title="Something went wrong"
      />
      <button-regular :class="$style.button" @click="resetErrors">
        Try again
      </button-regular>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { navigate } from 'utils/navigation';

  import PasswordResetForm from 'components/forms/PasswordResetForm';
  import AppEmptyState from '@/components/core/AppEmptyState';
  import IconErrorState from '@/assets/images/icons/error-state-widget.svg';
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import IconLogoLogin from '@/assets/images/icons/logo-login.svg';

  import { NEW_USER_REDIRECTION_DELAY } from 'constants/members';

  export default {
    name: 'PasswordResetPage',
    components: {
      PasswordResetForm,
      AppEmptyState,
      ButtonRegular,
      IconLogoLogin
    },
    props: {
      token: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        errors: {},
        passwordHasBeenReset: false
      };
    },
    computed: {
      ...mapGetters(['isLoadingPagePasswordResetRequest']),

      hasErrors() {
        return Object.keys(this.errors).length !== 0;
      },

      iconErrorState() {
        return IconErrorState;
      }
    },
    methods: {
      ...mapActions(['resetPassword', 'logout']),

      async submit({ password, confirmationPassword }) {
        try {
          await this.resetPassword({
            password,
            confirmationPassword,
            resetPasswordToken: this.token
          });
          this.errors = {};
          this.passwordHasBeenReset = true;
          this.logout();
          this.redirectUser();
        } catch (messages) {
          this.errors = { messages, password };
        }
      },

      redirectUser() {
        setTimeout(() => {
          navigate(this.$router, '/login');
        }, NEW_USER_REDIRECTION_DELAY);
      },

      resetErrors() {
        this.errors = {};
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .reset-page {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
  }

  .form-container {
    box-sizing: content-box;
    padding-left: 50px;
    max-width: 360px;
    width: 100%;
  }

  .card {
    display: flex;
    justify-content: space-between;
    padding: 50px;
  }

  .text {
    color: $color-text-main;
    line-height: 20px;
    margin: 30px 0;
  }

  .form-title {
    color: $base-matisse-blue;
    font-weight: bold;
    margin: 0 0 10px;
  }

  .header {
    padding-right: 50px;
  }

  .title {
    line-height: 32px;
    margin: 0 0 36px;
    color: $color-text-primary;
  }

  .redirect-text {
    color: $color-text-main;
    line-height: 20px;
    margin-bottom: 60px;
  }

  .link {
    font-weight: bold;
    color: $color-text-primary;
    text-decoration: none;
  }

  .empty-state {
    max-width: 330px;
  }

  .error-state-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
  }

  .button {
    margin-top: 80px;
    margin-bottom: 0;
    height: 48px;
    width: 196px;
  }
</style>
