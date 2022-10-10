<template>
  <ActionModal
    submit-button-text="Save"
    cancel-button-text="Cancel"
    :is-loading="isLoading"
    :size="modalSizesEnum.SMALL"
    @submit="onSubmit"
    @close="onCancel"
  >
    <template #headerContent>
      <h2 :class="$style.title">Create dashboard view</h2>
    </template>
    <div :class="$style.content">
      <ValidationField :v="$v.dashboard.name" :error-messages="errorMessages">
        <template #default="{ isError, errorMessage }">
          <InputText
            v-model.trim="dashboard.name"
            :class="$style.input"
            label="Dashboard name"
            :message="errorMessage || characterCount"
            :error="isError"
            :maxlength="$v.dashboard.name.$params.maxLength.max"
            @focus="$v.dashboard.name.$reset()"
          />
        </template>
      </ValidationField>
      <Checkbox
        :class="$style.checkbox"
        :checked="dashboard.default"
        :condensed="true"
        :reverse="true"
        theme="medium"
        @checked:update="toggleDefaultCheckbox"
      >
        <span :class="$style.checkboxLabel">Set as default view</span>
      </Checkbox>
      <Checkbox
        :class="$style.checkbox"
        :checked="dashboard.public"
        :condensed="true"
        :reverse="true"
        theme="medium"
        @checked:update="togglePublicCheckbox"
      >
        <span :class="$style.checkboxLabel">Make this dashboard public</span>
      </Checkbox>
    </div>
  </ActionModal>
</template>

<script>
  import Checkbox from 'components/core/Checkbox';
  import AppModal from 'components/modals/AppModal';
  import ActionModal from 'components/modals/ActionModal';
  import { maxLength, required } from 'vuelidate/lib/validators';
  import InputText from '@/components/inputs/new/InputText';
  import ValidationField from '@/components/renderless/ValidationField';
  import { modalSizesEnum } from '@/enums/modal-sizes';

  const MAX_DASHBOARD_NAME_LENGTH = 50;

  export default {
    components: {
      ValidationField,
      InputText,
      Checkbox,
      ActionModal
    },
    extends: AppModal,

    props: {
      saveDashboard: {
        type: Function,
        required: true
      },

      onCancel: {
        type: Function,
        required: true
      }
    },

    data() {
      return {
        dashboard: {
          default: false,
          public: false,
          name: ''
        },
        isLoading: false,
        errors: {}
      };
    },

    computed: {
      modalSizesEnum() {
        return modalSizesEnum;
      },

      errorMessages() {
        return {
          required: v =>
            `${this.dashboard.name.length}/${v.$params.maxLength.max} characters`,
          maxLength: v =>
            `${this.dashboard.name.length}/${v.$params.maxLength.max} You've reached the character limit.`,
          isNameInvalid: this.errors.messages && this.errors.messages.name
        };
      },

      characterCount() {
        return `${this.dashboard.name.length}/${MAX_DASHBOARD_NAME_LENGTH} characters`;
      }
    },

    methods: {
      async onSubmit() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        this.isLoading = true;
        this.errors = {};
        try {
          await this.saveDashboard(this.dashboard);
        } catch (e) {
          this.errors = { data: { name: this.dashboard.name }, messages: e };
        } finally {
          this.isLoading = false;
        }
      },

      toggleDefaultCheckbox() {
        this.dashboard.default = !this.dashboard.default;
      },

      togglePublicCheckbox() {
        this.dashboard.public = !this.dashboard.public;
      }
    },

    validations: {
      dashboard: {
        name: {
          required,
          maxLength: maxLength(MAX_DASHBOARD_NAME_LENGTH),
          isNameInvalid(currentName) {
            return !(this.errors.data && this.errors.data.name === currentName);
          }
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    margin: 0;
  }

  .checkbox {
    display: inline-flex;
    margin-bottom: 15px;

    width: fit-content;
  }

  .input {
    margin-top: 12px;
    margin-bottom: 42px;

    &-override {
      font-size: 14px;
    }
  }

  .checkbox-label {
    margin-left: 2px;
    color: $color-text-main;
  }

  .content {
    @include column;
  }
</style>
