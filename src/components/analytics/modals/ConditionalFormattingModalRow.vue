<template>
  <div :class="$style.container" :style="containerStyle">
    <template v-if="!isEditing">
      <div :class="$style.column">
        <span :class="$style.label">Format cells if...</span>
        <p
          :class="$style.formattingDesc"
          :style="{ color: formatting.textColor }"
        >
          {{ formatting.rule }} {{ formatting.value }}
        </p>
      </div>

      <ButtonSecondary
        :class="[$style.button, $style.buttonSaved]"
        small
        @click="onDeleteButtonClick"
      >
        Delete
      </ButtonSecondary>

      <ButtonPrimary
        :class="[$style.button, $style.buttonSaved]"
        small
        @click="onEditButtonClick"
      >
        Edit
      </ButtonPrimary>
    </template>
    <div v-else :class="$style.formattingForm">
      <InputSelect
        v-model="rule"
        :class="$style.inputSelect"
        label="Format cells if"
        :options="formatCellsIfOptions"
      >
        <template #item="{ item }">
          <span :class="$style.dropdownItem">{{ item.label }}</span>
        </template>
      </InputSelect>
      <div :class="$style.row">
        <InputNumber
          v-model="formattingLocal.value"
          :class="$style.inputNumber"
          decimal
        />
        <span>then</span>
        <ColorPicker
          v-model="formattingLocal.textColor"
          :colors="textPickerColors"
          placement="bottom-end"
        >
          <ButtonGhost :class="$style.buttonColorPicker" type="button">
            <IconFormatFont
              slot="icon"
              :style="{ color: formattingLocal.textColor }"
            />
          </ButtonGhost>
        </ColorPicker>
        <ColorPicker
          v-model="formattingLocal.backgroundColor"
          :colors="backgroundPickerColors"
          placement="bottom-end"
        >
          <ButtonGhost :class="$style.buttonColorPicker" type="button">
            <IconFormatBackground
              slot="icon"
              :style="{ color: formattingLocal.backgroundColor }"
            />
          </ButtonGhost>
        </ColorPicker>
      </div>
      <template v-if="saved">
        <ButtonSecondary
          :class="$style.button"
          small
          @click="onCancelEditButtonClick"
        >
          Cancel
        </ButtonSecondary>

        <ButtonTertiary
          :class="$style.button"
          :disabled="disabled"
          small
          @click="onUpdateButtonClick"
        >
          Update
        </ButtonTertiary>
      </template>
      <template v-else>
        <ButtonSecondary
          :class="$style.button"
          small
          @click="onCancelEditButtonClick"
        >
          Cancel
        </ButtonSecondary>

        <ButtonPrimary
          :class="$style.button"
          :disabled="disabled"
          small
          @click="onAddButtonClick"
        >
          Add
        </ButtonPrimary>
      </template>
    </div>
  </div>
</template>

<script>
  import { find, map } from 'lodash';
  import { required, requiredUnless } from 'vuelidate/lib/validators';
  import ColorPicker from 'components/app/ColorPicker';

  import conditionalFormattingRules from 'enums/conditional-formatting-rules';
  import backgroundPickerColors from 'enums/background-picker-colors';
  import textPickerColors from 'enums/text-picker-colors';
  import InputSelect from '@/components/inputs/new/InputSelect';
  import ConditionalFormatting from '@/classes/analytics/ConditionalFormatting';
  import InputNumber from '@/components/inputs/new/InputNumber';

  import IconFormatFont from '@/assets/images/icons/format-font.svg';
  import IconFormatBackground from '@/assets/images/icons/format-bg.svg';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import ButtonPrimary from '@/components/buttons/ButtonPrimary';
  import ButtonSecondary from '@/components/buttons/ButtonSecondary';
  import ButtonTertiary from '@/components/buttons/ButtonTertiary';

  export default {
    components: {
      ButtonTertiary,
      ButtonSecondary,
      ButtonPrimary,
      ButtonGhost,
      InputNumber,
      InputSelect,
      ColorPicker,
      IconFormatFont,
      IconFormatBackground
    },

    props: {
      formatting: {
        type: Object,
        default() {
          return ConditionalFormatting.default();
        }
      },
      saved: Boolean
    },

    data() {
      return {
        textPickerColors,
        backgroundPickerColors,
        formattingLocal: this.formatting.copy(),
        isEditing: !this.saved
      };
    },

    computed: {
      rule: {
        get() {
          return find(this.formatCellsIfOptions, [
            'id',
            this.formattingLocal.rule
          ]);
        },

        set(formatCellsIfOption) {
          this.formattingLocal.rule = formatCellsIfOption.id;
        }
      },

      formatCellsIfOptions() {
        return map(conditionalFormattingRules, rule => ({
          id: rule,
          label: rule
        }));
      },

      disabled() {
        return this.$v.$invalid;
      },

      containerStyle() {
        return !this.isEditing
          ? { backgroundColor: this.formatting.backgroundColor }
          : '';
      }
    },

    methods: {
      onAddButtonClick() {
        this.$emit('add', this.formattingLocal);

        this.formattingLocal = ConditionalFormatting.default();
      },

      onDeleteButtonClick() {
        this.$emit('delete', this.formatting.id);
      },

      onEditButtonClick() {
        this.isEditing = true;
      },

      onCancelEditButtonClick() {
        if (this.saved) {
          this.isEditing = false;
        }

        this.formattingLocal = this.formatting.copy();

        this.$emit('cancel', this.formattingLocal);
      },

      onUpdateButtonClick() {
        this.$emit('edit', this.formattingLocal);

        this.isEditing = false;
      }
    },

    validations: {
      formattingLocal: {
        value: {
          required
        },
        rule: {
          required
        },
        textColor: {
          required: requiredUnless(function () {
            return Boolean(this.formattingLocal.backgroundColor);
          })
        },
        backgroundColor: {
          required: requiredUnless(function () {
            return Boolean(this.formattingLocal.textColor);
          })
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    align-items: center;

    padding: 0 40px;

    height: 80px;

    &:hover {
      .button-saved {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .formatting-form {
    @include row;
    align-items: flex-end;

    flex: 1;

    gap: 8px;
  }

  .row {
    @include row;
    align-items: flex-end;
    gap: 8px;

    flex: 1;

    & > span {
      align-self: center;

      margin: 0 8px;
    }
  }

  .column {
    @include column;
  }

  .button-saved {
    visibility: hidden;
    opacity: 0;

    transition: opacity 0.2s;
  }

  .button-saved + .button-saved {
    margin-left: 8px;
  }

  .button-color-picker {
    border: 1px solid $color-border-main-light;

    color: $color-text-main;

    &:hover {
      color: inherit;
    }
  }

  .dropdown-item {
    padding: 16px 0;
  }

  .input-select {
    width: 196px;
  }

  .input-number {
    width: 160px;
  }

  .label {
    display: block;
    font-size: 12px;

    color: $color-text-main;
  }

  .formatting-desc {
    font-weight: bold;
    margin: 0;
  }

  .button {
    width: 88px;

    align-self: center;
    text-transform: uppercase;

    &:first-of-type {
      margin-left: auto;
    }
  }
</style>
