<template>
  <action-modal
    :title="title"
    submitButtonText="Save"
    cancelButtonText="Cancel"
    :isLoading="isLoading"
    :disableBackdropClosing="true"
    :showDelete="showDelete"
    @submit="onSubmit"
    @close="close"
    @delete="onDelete"
  >
    <div :class="$style.content">
      <validation-input
        :class="$style.input"
        :classOverride="$style.inputOverride"
        v-model.trim="name"
        ref="nameInput"
        :placeholder="placeholder"
        :helperText="helperText"
        :v="$v.name"
        :maxlength="50"
        :isInvalid="isInputFocused && name.length === 50"
        :errorMessages="errorMessages"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
        @update="onNameInput"
      />
      <div :class="$style.checkbox">
        <checkbox
          :checked="isDefault"
          :condensed="true"
          :reverse="true"
          @checked:update="toggleDefaultCheckbox"
        >
          <span :class="$style.checkboxLabel">{{ defaultCheckboxLabel }}</span>
        </checkbox>
      </div>
      <div :class="$style.checkbox">
        <checkbox
          :checked="isPublic"
          :condensed="true"
          :reverse="true"
          @checked:update="togglePublicCheckbox"
        >
          <span :class="$style.checkboxLabel">{{ publicCheckboxLabel }}</span>
        </checkbox>
      </div>
    </div>
  </action-modal>
</template>

<script>
  import { cloneDeep } from 'lodash';

  import Checkbox from 'components/core/Checkbox';
  import ActionModal from 'components/modals/ActionModal';
  import ValidationInput from 'components/inputs/ValidationInput';
  import { required } from 'vuelidate/lib/validators';
  import { errorMessagesFactory } from 'utils/validation';

  export default {
    extends: ActionModal,
    components: {
      Checkbox,
      ActionModal,
      ValidationInput
    },

    props: {
      title: {
        type: String,
        required: true
      },

      placeholder: {
        type: String,
        default: ''
      },

      defaultCheckboxLabel: {
        type: String,
        default: 'Set as default'
      },

      publicCheckboxLabel: {
        type: String,
        default: 'Make public'
      },

      isLoading: {
        type: Boolean,
        default: false
      },

      preference: {
        type: Object,
        default: null
      },

      errors: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    computed: {
      isEdit() {
        return Boolean(this.preference);
      },

      errorMessages() {
        return errorMessagesFactory({
          required: "Name can't be blank",
          isNameInvalid:
            'This name is already taken, please choose a different name.',
          genericError: 'An error occurred.'
        });
      },

      helperText() {
        if (!this.isInputFocused || this.name.length < 50) {
          return '';
        }

        return '50/50 You’ve reached the character limit.';
      }
    },

    methods: {
      onSubmit() {
        this.showGenericError = false;

        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        this.showGenericError = true;

        const filterSetData = {
          name: this.name,
          isPublic: this.isPublic,
          isDefault: this.isDefault
        };

        if (this.isEdit) {
          filterSetData.id = this.preference.id;
          filterSetData.configuration = cloneDeep(
            this.preference.configuration
          );
        }

        this.$emit(this.isEdit ? 'edit' : 'create', filterSetData);
      },

      onCancel() {
        this.close();
      },

      toggleDefaultCheckbox() {
        this.isDefault = !this.isDefault;
      },

      togglePublicCheckbox() {
        this.isPublic = !this.isPublic;
      },

      onNameInput() {
        this.$v.name.$reset();
        this.showGenericError = false;
      }
    },

    data() {
      return {
        isDefault: (this.preference && this.preference.isDefault) || false,
        isPublic: (this.preference && this.preference.isPublic) || false,
        name: (this.preference && this.preference.name) || '',
        isInputFocused: false,
        showGenericError: false
      };
    },

    mounted() {
      // Ensures all child components are mounted
      this.$nextTick(() => {
        this.$refs.nameInput.$el.focus();
      });
    },

    validations: {
      name: {
        required,
        isNameInvalid(currentName) {
          return !(
            this.errors.messages &&
            this.errors.messages.name &&
            this.errors.data &&
            this.errors.data.name === currentName
          );
        },
        genericError() {
          return !(
            this.showGenericError &&
            this.$v.name.isNameInvalid &&
            this.errors.messages
          );
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .checkbox {
    display: inline-flex;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 32px;
    }
  }

  .input {
    margin: 34px 0;

    &-override {
      font-size: 14px;
    }
  }

  .checkbox-label {
    margin-left: 15px;
    color: $color-text-main;
  }

  .content {
    @include column;
  }
</style>
