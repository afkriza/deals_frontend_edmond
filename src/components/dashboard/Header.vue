<template>
  <div :class="$style.dashboardHeader">
    <div>
      <div :class="$style.nameWrapper">
        <h2 v-if="!isEditMode" :class="$style.dashboardName">
          {{ dashboard.name }}
        </h2>
        <ValidationField v-else :v="v" :error-messages="errorMessages">
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="_name"
              label="Dashboard name"
              :class="$style.dashboardNameInput"
              :message="isError ? errorMessage : helperText"
              :maxlength="v.$params.maxLength.max"
              :error="isError"
              @focus="v.$reset()"
            />
          </template>
        </ValidationField>
        <span
          v-if="!isEditMode && !readonly"
          :class="$style.editBtn"
          @click="onEditDashboardClick"
        >
          Edit
        </span>
      </div>
    </div>

    <div v-if="!isEditMode" :class="$style.rightAligned">
      <div
        v-if="dashboard.public && !readonly"
        :class="$style.dashboardOption"
        @click="togglePublic"
      >
        <span :class="$style.dashboardOptionIcon">
          <!-- @svg("unlock") -->
        </span>
        <span :class="$style.dashboardOptionText">Public</span>
      </div>
      <div
        v-else-if="!dashboard.public && !readonly"
        :class="$style.dashboardOption"
        @click="togglePublic"
      >
        <span :class="$style.dashboardOptionIcon">
          <!-- @svg("lock") -->
        </span>
        <span :class="$style.dashboardOptionText">Private</span>
      </div>
      <div
        v-if="isDefault"
        :class="$style.dashboardOption"
        @click="toggleDefault"
      >
        <span :class="$style.dashboardOptionIcon">
          <!-- @svg("star-filled") -->
        </span>
        <span :class="$style.dashboardOptionText">Default dashboard</span>
      </div>
      <div v-else :class="$style.dashboardOption" @click="toggleDefault">
        <span :class="$style.dashboardOptionIcon">
          <!-- @svg("star") -->
        </span>
        <span :class="$style.dashboardOptionText">Set as default</span>
      </div>
      <div :class="$style.dashboardOption">
        <DisplayDensityDropdown
          :active-display-density="displayDensity"
          @displayDensity:click="onDisplayDensityClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import DisplayDensityDropdown from 'components/dashboard/DisplayDensityDropdown';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputText from '@/components/inputs/new/InputText';

  export default {
    components: {
      InputText,
      ValidationField,
      DisplayDensityDropdown
    },

    props: {
      dashboard: {
        type: Object,
        required: true
      },

      isDefault: {
        type: Boolean,
        required: true
      },

      isEditMode: {
        type: Boolean,
        default: false
      },

      name: {
        type: String,
        default: ''
      },

      readonly: {
        type: Boolean,
        default: false
      },

      displayDensity: {
        type: String,
        required: true
      },

      v: {
        type: Object,
        required: true
      },

      errors: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    computed: {
      _name: {
        get() {
          return this.name;
        },

        set(newName) {
          this.$emit('name:input', newName);
        }
      },

      errorMessages() {
        return {
          required: "Name can't be blank",
          maxLength: v =>
            `${this.name.length}/${v.$params.maxLength.max} You've reached the character limit.`,
          isNameInvalid:
            this.errors.messages &&
            this.errors.messages.name &&
            'The name is already taken. Please choose a different name.'
        };
      },

      helperText() {
        return `${this.name.length}/50 characters`;
      }
    },

    methods: {
      onDisplayDensityClick(density) {
        this.$emit('displayDensity:click', density);
      },

      onEditDashboardClick() {
        this.$emit('edit');
      },

      togglePublic() {
        this.$emit('public:toggle');
      },

      toggleDefault() {
        this.$emit('default:toggle');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dashboard-header {
    display: flex;
    color: $color-text-main;
  }

  .name-wrapper {
    display: flex;
    align-items: baseline;

    margin-bottom: 8px;
  }

  .dashboard-option {
    display: inline-flex;
    align-items: center;

    cursor: pointer;

    // Used for increasing click area, consider moving to mixin in case of repeating logic
    &:not(:first-child) {
      padding-left: 5px;
    }

    &:not(:last-child) {
      margin-right: 20px;
      padding-right: 5px;
    }
  }

  .dashboard-option-icon {
    height: 16px;
    margin-right: 8px;
  }

  .dashboard-option-text {
    font-size: 12px;
  }

  .dashboard-name {
    margin: 0 14px 0 0;
  }

  .edit-btn {
    font-weight: bold;

    text-transform: uppercase;

    cursor: pointer;
  }

  .dashboard-name-input {
    width: 400px;
  }

  .right-aligned {
    display: flex;
    margin-left: auto;
  }
</style>
