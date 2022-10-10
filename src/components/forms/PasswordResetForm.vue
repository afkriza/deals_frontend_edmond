<template>
  <form :class="$style.form" @submit.prevent="onSubmit">
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
      :isLoading="submitting"
    >
      Set new password
    </button-regular>
  </form>
</template>

<script>
  import { minLength, required, sameAs } from 'vuelidate/lib/validators';

  import ButtonRegular from 'components/buttons/ButtonRegular';
  import ValidationInput from 'components/inputs/ValidationInput';

  export default {
    name: 'PasswordResetForm',
    components: {
      ButtonRegular,
      ValidationInput
    },
    props: {
      submitting: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      isSubmittable() {
        return !this.$v.$invalid;
      }
    },
    data() {
      return {
        confirmPassword: '',
        password: ''
      };
    },

    methods: {
      onSubmit() {
        this.$emit('submit', {
          password: this.password,
          confirmationPassword: this.confirmPassword
        });
      }
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

  .form {
    display: flex;
    flex-direction: column;
  }

  .button {
    margin-top: 30px;
    margin-bottom: 0;
    height: 48px;
    width: 176px;
  }

  .input {
    height: 56px;
    margin-bottom: 10px;
  }
</style>
