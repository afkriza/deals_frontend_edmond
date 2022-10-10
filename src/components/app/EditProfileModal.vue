<template>
  <ActionModal
    title="Edit profile"
    submit-button-text="Update"
    cancel-button-text="Cancel"
    :size="modalSizesEnum.SMALL"
    :is-loading="loading"
    @submit="onSubmit"
    @close="close"
  >
    <section :class="$style.content">
      <div :class="[$style.row, $style.split]">
        <ValidationField
          :v="$v.firstName"
          :error-messages="errorMessagesFirstName"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="firstName"
              label="First name"
              :message="errorMessage"
              :error="isError"
              @focus="$v.firstName.$reset()"
            />
          </template>
        </ValidationField>
        <ValidationField
          :v="$v.lastName"
          :error-messages="errorMessagesLastName"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="lastName"
              label="Last name"
              :message="errorMessage"
              :error="isError"
              @focus="$v.lastName.$reset()"
            />
          </template>
        </ValidationField>
      </div>

      <ValidationField :v="$v.email" :error-messages="errorMessagesEmail">
        <template #default="{ isError, errorMessage }">
          <InputText
            v-model.trim="email"
            label="Email"
            :message="errorMessage"
            :error="isError"
            @focus="$v.email.$reset()"
          />
        </template>
      </ValidationField>

      <div v-if="areEmailReportsAvailable" :class="$style.emailReports">
        <label :class="$style.label">Email reports</label>

        <InputCheckbox
          v-for="emailReport in emailReports"
          :key="emailReport.id"
          v-model="emailReport.active"
          :label="emailReport.name"
        />
      </div>
    </section>
  </ActionModal>
</template>

<script>
  import { email, required } from 'vuelidate/lib/validators';
  import { map, filter, some } from 'lodash';

  import ActionModal from 'components/modals/ActionModal';

  import { errorMessagesFactory } from 'utils/validation';
  import { emailReportsEnum } from 'enums/email-reports';

  import InputText from '@/components/inputs/new/InputText';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputCheckbox from '@/components/inputs/new/InputCheckbox';
  import { Roles } from '@/enums/member-roles';
  import { modalSizesEnum } from '@/enums/modal-sizes';

  export default {
    components: {
      InputCheckbox,
      ValidationField,
      InputText,
      ActionModal
    },
    extends: ActionModal,

    props: {
      user: {
        type: Object,
        required: true
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

    data() {
      return {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        email: this.user.email,
        emailReports: map(Object.values(emailReportsEnum), emailReport => ({
          ...emailReport,
          active: some(this.user.reports, ['id', emailReport.id])
        }))
      };
    },

    computed: {
      modalSizesEnum() {
        return modalSizesEnum;
      },

      areEmailReportsAvailable() {
        return this.user.role.id !== Roles.SALES;
      },

      isSubmittable() {
        return !this.$v.$invalid;
      },

      errorMessagesFirstName() {
        return errorMessagesFactory('required', 'Please enter a name');
      },

      errorMessagesLastName() {
        return errorMessagesFactory('required', 'Please enter a surname');
      },

      errorMessagesEmail() {
        return errorMessagesFactory({
          required: 'Please enter an email address',
          isEmailInvalid: this.errors.messages && this.errors.messages.email
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
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          reportMembership: map(
            filter(this.emailReports, 'active'),
            ({ id }) => ({
              id,
              type: 'report'
            })
          )
        };

        this.$emit('submit', data);
      }
    },

    validations: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required,
        email,
        isEmailInvalid(currentEmail) {
          return !(this.errors.data && this.errors.data.email === currentEmail);
        }
      }
    }
  };
</script>
<style lang="scss" module>
  @import 'utils';

  .content {
    @include column;

    gap: 30px;

    padding-bottom: 16px;
  }

  .row {
    @include row;
    align-items: center;
  }

  .row + .row {
    margin-top: 30px;
  }

  .split {
    gap: 16px;

    & > * {
      flex: 1;
    }
  }

  .email-reports {
    @include column;
    align-items: flex-start;

    padding-top: 16px;

    gap: 8px;

    .label {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;

      color: $color-text-main-light;

      margin-bottom: 8px;
    }
  }
</style>
