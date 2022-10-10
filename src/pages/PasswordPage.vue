<template>
  <div :class="$style.container">
    <template v-if="!accountActivated">
      <h1 :class="$style.title">Welcome, {{ name }}!</h1>
      <p :class="$style.text">
        Before you can get started with your account, you must set a password.
      </p>
      <validation-input
        :class="$style.input"
        :v="$v.password"
        v-model="$v.password.$model"
        label="Password"
        type="password"
      />
      <validation-input
        :class="$style.input"
        :v="$v.confirmPassword"
        v-model="$v.confirmPassword.$model"
        label="Confirm password"
        type="password"
      />
      <button-regular
        :class="$style.button"
        :disabled="!isSubmittable"
        :isLoading="isPasswordSaving"
        @click="onSubmit"
        >Set password</button-regular
      >
    </template>
    <template v-else>
      <h1 :class="$style.title">Account activated</h1>
      <p :class="$style.text">
        We will automatically redirect you the login page.
        <br />If nothing is happening, please
        <router-link :class="$style.link" to="/login"
          >click here to continue.</router-link
        >
      </p>
    </template>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { minLength, required, sameAs } from 'vuelidate/lib/validators';

  import ValidationInput from 'components/inputs/ValidationInput';
  import ButtonRegular from 'components/buttons/ButtonRegular';

  import { NEW_USER_REDIRECTION_DELAY } from 'constants/members';
  import { navigate } from 'utils/navigation';

  export default {
    components: {
      ValidationInput,
      ButtonRegular
    },

    computed: {
      isSubmittable() {
        return !this.$v.$invalid;
      },

      ...mapGetters('password', ['isPasswordSaving', 'isPasswordSaved'])
    },

    methods: {
      onSubmit() {
        const data = {
          invitationToken: this.token,
          password: this.password
        };

        this.setPassword(data).then(() => {
          this.accountActivated = true;

          setTimeout(() => {
            navigate(this.$router, '/login');
          }, NEW_USER_REDIRECTION_DELAY);
        });
      },

      ...mapActions('password', ['setPassword'])
    },

    mounted() {
      this.name = this.$route.query.name || '';
      this.token = this.$route.query.token || '';
    },

    data() {
      return {
        accountActivated: false,
        confirmPassword: '',
        done: false,
        loading: false,
        name: '',
        password: '',
        token: ''
      };
    },

    validations: {
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    padding-top: 7px;
  }

  .button {
    width: 176px;
    height: 48px;
  }

  .title {
    line-height: 32px;
    margin: 0 0 36px;
    color: $color-text-primary;
  }

  .text {
    color: $color-text-main;
    line-height: 20px;
    margin-bottom: 60px;
  }

  .link {
    font-weight: bold;
    color: $color-text-primary;
    text-decoration: none;
  }

  .container .input {
    margin-bottom: 49px;

    &:last-of-type {
      margin-bottom: 56px;
    }
  }
</style>
