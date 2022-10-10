<template>
  <form :class="$style.form" @submit.prevent="submit">
    <div :class="$style.inputs">
      <ValidationField :v="$v.email">
        <template #default="{ isError, errorMessage}">
          <InputText
            :class="$style.input"
            v-model.trim="$v.email.$model"
            label="Email"
            :error="isError"
            :message="errorMessage"
            @focus="invalidLogin = false"
          />
        </template>
      </ValidationField>
      <ValidationField :v="$v.password">
        <template #default="{ isError, errorMessage}">
          <InputPassword
            :class="$style.input"
            v-model="$v.password.$model"
            label="Password"
            :error="isError"
            :message="errorMessage"
            @focus="invalidLogin = false"
          />
        </template>
      </ValidationField>
    </div>

    <RequestStatusError
      v-show="invalidLogin"
      :class="$style.status"
      text="Incorrect username or password"
    />

    <ButtonRegular
      type="submit"
      :class="$style.button"
      :isLoading="isSubmitting"
      :disabled="isDisabled"
    >
      Log in
    </ButtonRegular>
    <ButtonFlat
      type="button"
      :class="$style.forgotPassword"
      @click="openModal('resetPassword')"
    >
      Forgot password?
    </ButtonFlat>

    <reset-password-modal
      v-if="isResetPasswordModalOpen"
      :loading="isLoadingPasswordResetRequest"
      :errors="errors"
      @submit="onResetPasswordRequestSubmit"
      @close="closeModal"
    />
  </form>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { email, required } from 'vuelidate/lib/validators';
  import { toastFactory } from 'utils/toast';
  import { toastTypesEnum } from 'enums/toast-types';

  import ButtonRegular from 'components/buttons/ButtonRegular';
  import ResetPasswordModal from 'components/app/ResetPasswordModal';
  import { navigate } from 'utils/navigation';
  import InputText from '@/components/inputs/new/InputText';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputPassword from '@/components/inputs/new/InputPassword';
  import ButtonFlat from '@/components/buttons/ButtonFlat';
  import RequestStatusError from '@/components/misc/RequestStatusError';

  export default {
    components: {
      RequestStatusError,
      ButtonFlat,
      InputPassword,
      ValidationField,
      InputText,
      ButtonRegular,
      ResetPasswordModal
    },
    computed: {
      isDisabled() {
        return this.$v.$invalid;
      },

      isResetPasswordModalOpen() {
        return this.currentOpenModal === 'resetPassword';
      },

      ...mapGetters(['isLoadingPasswordResetRequest'])
    },
    methods: {
      async submit() {
        this.isSubmitting = true;
        this.invalidLogin = false;

        try {
          await this.login({
            email: this.email,
            password: this.password
          });
          const nextPage = this.$store.state.session.nextPathName || {
            path: '/'
          };

          await navigate(this.$router, nextPage);
        } catch (e) {
          this.invalidLogin = true;
          this.isSubmitting = false;
        }
      },

      openModal(modal) {
        this.currentOpenModal = modal;
      },

      closeModal() {
        this.currentOpenModal = '';
      },

      async onResetPasswordRequestSubmit(data) {
        try {
          await this.resetPasswordRequest(data);

          this.updateToast(
            toastFactory('Reset password request sent', toastTypesEnum.SUCCESS)
          );
          this.closeModal('resetPassword');

          this.errors = {};
        } catch (messages) {
          this.errors = { messages, data };
        }
      },

      ...mapActions(['login', 'resetPasswordRequest', 'updateToast'])
    },
    data() {
      return {
        email: '',
        password: '',
        isSubmitting: false,
        invalidLogin: false,
        currentOpenModal: '',
        errors: null
      };
    },

    validations: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .form {
    @include column;
  }

  .button {
    margin-top: 14px;
    height: 48px;
  }

  .input + .input {
    margin-top: 30px;
  }

  .inputs {
    margin-bottom: 28px;
  }

  .forgot-password {
    margin-top: 24px;
    color: $color-text-primary;
    text-transform: none;
    font-weight: bold;
    cursor: pointer;
    height: 48px;

    transition: box-shadow 0.1s ease-in-out;
    &:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      color: $color-text-primary-highlight;
    }
  }

  .status {
    align-self: flex-start;
    margin-bottom: 20px;
  }
</style>
