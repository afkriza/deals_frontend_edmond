<template>
  <AnalysisCalculatorBaseCard :class="$style.card">
    <template v-if="isEmpty">
      <div :class="$style.column">
        <b>No data found</b>
        <span>Try using different filters.</span>
      </div>
    </template>
    <template v-else>
      <span :class="$style.title">{{ title }}</span>
      <b :class="$style.text">{{ text }}</b>
    </template>
  </AnalysisCalculatorBaseCard>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { isNumber } from 'lodash';
  import AnalysisCalculatorBaseCard from '@/components/groups/analysis/AnalysisCalculatorBaseCard.vue';

  @Component({
    components: { AnalysisCalculatorBaseCard }
  })
  export default class AnalysisCalculatorTextCard extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly title: string;

    @Prop({
      type: String
    })
    readonly text: string;

    get isEmpty() {
      return !this.text;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include row;
    align-items: center;
    justify-content: space-between;

    color: $color-text-main-lighter;

    line-height: 20px;
  }

  .column {
    @include column;

    align-items: center;

    width: 100%;
  }

  .text {
    color: $color-text-light;

    font-size: 20px;
    line-height: 24px;
  }
</style>
