<template>
  <action-modal
    title="Numeric formatting"
    :size="modalSizesEnum.SMALL"
    :isDisabled="!isValid"
    submitButtonText="Save"
    cancelButtonText="Cancel"
    @submit="onSubmit"
    @close="close"
  >
    <multi-switch
      :class="$style.multiSwitch"
      :switcherModes="numericFormattingTypes"
      :currentSwitcherMode="activeFormattingType"
      @change="toggleFormattingType"
    >
      <template v-slot="{ switcherMode }">{{
        capitalize(switcherMode)
      }}</template>
    </multi-switch>
    <div :class="$style.dropdownsWrapper">
      <div :class="$style.dropdownWrapper">
        <material-dropdown
          :isOpen="isDecimalPlacesDropdownOpen"
          :items="decimalPlaces"
          :value="decimalPlacesValue"
          label="Decimal places"
          @open="openDropdown('decimal')"
          @close="closeDropdown"
          @item:click="onDecimalPlacesItemClick"
        />
      </div>
      <div :class="$style.dropdownWrapper">
        <material-dropdown
          v-if="isCurrencyFormatting"
          :isOpen="isCurrencyDropdownOpen"
          :items="currencies"
          :value="currenciesValue"
          label="Currency"
          @open="openDropdown('currency')"
          @close="closeDropdown"
          @item:click="onCurrencyClick"
        />
      </div>
    </div>
    <div v-if="isPercentageFormatting" :class="$style.checkboxWrapper">
      <checkbox-field
        :checked="percentageChangeChecked"
        :condensed="true"
        :reverse="true"
        verticalAlignment="top"
        @checked:update="togglePercentageChange"
      >
        <div :class="$style.checkboxLabelWrapper">
          <h4 :class="$style.checkboxLabel">Display as percentage change</h4>
          <p :class="$style.checkboxDesc">
            Relative change between old value and new value
            <span :class="$style.checkboxExample"
              >Ex. If the calculation result is 1.1, display it as +10%</span
            >
          </p>
        </div>
      </checkbox-field>
    </div>
  </action-modal>
</template>

<script>
  import CheckboxField from 'components/core/Checkbox';
  import ActionModal from 'components/modals/ActionModal';
  import MaterialDropdown from 'components/app/MaterialDropdown';
  import MultiSwitch from 'components/core/MultiSwitch';

  import numericFormattingTypes, {
    numericFormattingTypesEnum
  } from 'enums/numeric-formatting-types';
  import { modalSizesEnum } from 'enums/modal-sizes';

  import currencies, { currenciesEnum } from 'enums/currencies';
  import { capitalize } from 'utils/string';
  import { isTruthyOrZero } from 'utils/number';

  import NumericFormattingModel from 'components/analytics/models/NumericFormatting';

  export default {
    components: {
      CheckboxField,
      ActionModal,
      MaterialDropdown,
      MultiSwitch
    },

    props: {
      formatting: {
        type: NumericFormattingModel,
        required: true
      }
    },

    computed: {
      isDecimalPlacesDropdownOpen() {
        return this.currentOpenedDropdown === 'decimal';
      },

      isCurrencyDropdownOpen() {
        return this.currentOpenedDropdown === 'currency';
      },

      hasDecimalPlacesValue() {
        return isTruthyOrZero(this.decimalPlacesValue);
      },

      isNumberFormatting() {
        return this.activeFormattingType === numericFormattingTypesEnum.NUMBER;
      },

      isPercentageFormatting() {
        return (
          this.activeFormattingType === numericFormattingTypesEnum.PERCENTAGE
        );
      },

      isCurrencyFormatting() {
        return (
          this.activeFormattingType === numericFormattingTypesEnum.CURRENCY
        );
      },

      isValid() {
        if (this.isNumberFormatting) {
          return this.hasDecimalPlacesValue;
        } else if (this.isPercentageFormatting) {
          return this.hasDecimalPlacesValue;
        }
        return Boolean(this.currenciesValue && this.hasDecimalPlacesValue);
      }
    },

    methods: {
      toggleFormattingType(formattingType) {
        this.activeFormattingType = formattingType;
        this.setDefaultValues();
      },

      openDropdown(dropdown) {
        this.currentOpenedDropdown = dropdown;
      },

      closeDropdown() {
        this.currentOpenedDropdown = '';
      },

      onDecimalPlacesItemClick(decimalPlaces) {
        this.decimalPlacesValue = decimalPlaces;
        this.closeDropdown();
      },

      onCurrencyClick(currency) {
        this.currenciesValue = currency;
        this.closeDropdown();
      },

      setDefaultValues() {
        if (this.isNumberFormatting) {
          this.decimalPlacesValue = 0;
        } else if (this.isPercentageFormatting) {
          this.decimalPlacesValue = 2;
        } else if (this.isCurrencyFormatting) {
          this.currenciesValue = currenciesEnum.EURO.name;
          this.decimalPlacesValue = 0;
        }
      },

      togglePercentageChange() {
        this.percentageChangeChecked = !this.percentageChangeChecked;
      },

      gatherFormattingData() {
        return NumericFormattingModel.from({
          currency: this.isCurrencyFormatting ? this.currenciesValue : null,
          decimalPlaces: this.decimalPlacesValue,
          percentageChange: this.isPercentageFormatting
            ? this.percentageChangeChecked
            : false,
          type: this.activeFormattingType
        });
      },

      close() {
        this.$emit('close');
      },

      onSubmit() {
        const data = this.gatherFormattingData();

        this.$emit('numericFormatting:submit', data);
      }
    },

    data() {
      return {
        capitalize,
        numericFormattingTypes,
        numericFormattingTypesEnum,
        modalSizesEnum,
        activeFormattingType:
          this.formatting.type || numericFormattingTypesEnum.NUMBER,
        currentOpenedDropdown: '',
        currencies: currencies.map(({ name }) => name),
        currenciesValue: this.formatting.currency || '',
        decimalPlaces: [0, 1, 2],
        decimalPlacesValue: this.formatting.decimalPlaces || 0,
        percentageChangeChecked: this.formatting.percentageChange || false
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .multi-switch {
    margin-top: 24px;
  }

  .dropdowns-wrapper {
    margin-top: 25px;
  }

  .dropdown-wrapper {
    display: inline-block;
    width: 112px;

    &:not(:last-child) {
      margin-right: 25px;
    }
  }

  .checkbox-wrapper {
    margin-top: 30px;
  }

  .checkbox-label {
    margin: 0 0 5px;
    color: $color-text-main;
  }

  .checkbox-desc {
    font-size: 14px;
    line-height: 1.43em;

    margin: 0;

    color: $color-text-main-lighter;
  }

  .checkbox-example {
    font-style: italic;
    display: block;
  }
</style>
