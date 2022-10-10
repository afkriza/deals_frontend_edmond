<template>
  <div :class="$style.wrapper">
    <pinned-radio-select-filter
      :class="$style.filter"
      :options="numeratorOptions"
      :text-after="numeratorValueText"
      v-model="numerator_"
      :loading="numeratorLoading"
    />
    <slash-icon />
    <pinned-radio-select-filter
      :class="$style.filter"
      :options="filteredDenominatorOptions(numerator_)"
      :text-after="denominatorValueText"
      v-model="denominator_"
      :loading="denominatorLoading"
    />
  </div>
</template>

<script>
  import { remove } from 'lodash';

  import SlashIcon from '../icons/Slash';
  import PinnedRadioSelectFilter from './PinnedRadioSelectFilter';
  import { formatPriceNumber } from '@/utils/format';

  export default {
    name: 'MeasureFilter',
    components: {
      PinnedRadioSelectFilter,
      SlashIcon
    },
    props: {
      numerator: {
        type: Object,
        required: true
      },
      denominator: {
        type: Object,
        required: true
      },
      numeratorOptions: {
        type: Array,
        default: () => []
      },
      denominatorOptions: {
        type: Array,
        default: () => []
      },
      numeratorValue: {
        type: Number,
        default: null
      },
      denominatorValue: {
        type: Number,
        default: null
      },
      numeratorLoading: Boolean,
      denominatorLoading: Boolean
    },
    computed: {
      numerator_: {
        get() {
          return this.numerator;
        },

        set(newNumerator) {
          this.$emit('update:numerator', newNumerator);
          this.$emit('update:filter');

          if (
            newNumerator.id !== 'roomnight' &&
            this.denominator.id === 'capacity'
          ) {
            this.denominator_ = this.filteredDenominatorOptions(
              newNumerator
            )[0];
          }
        }
      },
      numeratorValueText() {
        return this.numeratorValue !== null
          ? formatPriceNumber(this.numeratorValue)
          : '?';
      },
      denominator_: {
        get() {
          return this.denominator;
        },

        set(newDenominator) {
          this.$emit('update:denominator', newDenominator);
          this.$emit('update:filter');
        }
      },
      denominatorValueText() {
        return this.denominatorValue !== null
          ? formatPriceNumber(this.denominatorValue)
          : '?';
      }
    },
    methods: {
      filteredDenominatorOptions(numerator) {
        if (numerator.id === 'roomnight') {
          return this.denominatorOptions;
        }

        return remove(
          [...this.denominatorOptions],
          option => option.id !== 'capacity'
        );
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    display: flex;
  }

  .filter {
    flex: 1;
  }
</style>
