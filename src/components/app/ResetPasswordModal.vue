<template>
  <action-modal
    title="Reset Password"
    submitButtonText="Send e-mail"
    cancelButtonText="Cancel"
    width="640px"
    :isLoading="loading"
    @submit="onSubmit"
    @close="close"
  >
    <p :class="$style.text">
      Please enter your e-mail address to request a password reset.
    </p>
    <div :class="$style.resetPassword">
      <label for="first-name">Email</label>
      <validation-input
        id="email"
        :v="$v.userEmail"
        v-model.trim="userEmail"
        aria-label="Email"
        :errorMessages="errorMessagesEmail"
        @update="$v.userEmail.$reset"
      />
    </div>
  </action-modal>
</template>

<script>
  import { email, required } from 'vuelidate/lib/validators';

  import ActionModal from 'components/modals/ActionModal';
  import ValidationInput from 'components/inputs/ValidationInput';

  import { errorMessagesFactory } from 'utils/validation';

  export default {
    extends: ActionModal,

    components: {
      ActionModal,
      ValidationInput
    },

    props: {
      email: {
        type: String,
        required: false
      },

      loading: {
        type: Boolean,
        default: false
      },

      errors: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    computed: {
      errorMessagesEmail() {
        return errorMessagesFactory({
          required: 'Please enter an email address',
          isEmailInvalid: Boolean(
            this.errors && this.errors.messages && this.errors.messages.email
          )
        });
      }
    },

    methods: {
      close() {
        this.$emit('close');
      },

      onSubmit() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        const data = {
          email: this.userEmail
        };

        this.$emit('submit', data);
      }
    },

    data() {
      return {
        userEmail: this.email
      };
    },

    validations: {
      userEmail: {
        required,
        email,
        isEmailInvalid(currentEmail) {
          return !(
            this.errors &&
            this.errors.data &&
            this.errors.data.email === currentEmail
          );
        }
      }
    }
  };
</script>
<style lang="scss" module>
  @import 'utils';

  .reset-password {
    display: grid;
    grid-template-columns: 130px auto;
    grid-column-gap: 50px;
    align-items: center;
    padding-top: 26px;
    padding-bottom: 24px;
  }

  .text {
    color: $color-text-main;
    line-height: 20px;
  }
</style>
