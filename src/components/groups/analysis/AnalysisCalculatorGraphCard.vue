<template>
  <AnalysisCalculatorBaseCard :class="$style.card">
    <slot name="header" />
    <template v-if="loading">
      <AppLoader loading-text="Loading prices..." dark />
    </template>
    <template v-else-if="error">
      <AppEmptyState
        :empty-state-icon="ErrorStateIllustration"
        title="Something went wrong"
        description="We couln’t load the price analysis."
        dark
      />
    </template>
    <template v-else-if="empty">
      <AppEmptyState
        :empty-state-icon="EmptyStateIllustration"
        title="No data found"
        description="There are no results based on your filtering criteria."
        dark
      />
    </template>
    <template v-else>
      <slot />
    </template>
  </AnalysisCalculatorBaseCard>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import AnalysisCalculatorBaseCard from '@/components/groups/analysis/AnalysisCalculatorBaseCard.vue';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';

  import EmptyStateIllustration from '@/assets/images/icons/Empty state/general-dark.svg';
  import ErrorStateIllustration from '@/assets/images/icons/Error state/general-dark.svg';
  import AppLoader from '@/components/app/AppLoader.vue';

  @Component({
    components: { AppLoader, AppEmptyState, AnalysisCalculatorBaseCard }
  })
  export default class AnalysisCalculatorGraphCard extends Vue {
    @Prop({
      type: Boolean
    })
    readonly loading: boolean;
    @Prop({
      type: Boolean
    })
    readonly error: boolean;
    @Prop({
      type: Boolean
    })
    readonly empty: boolean;

    get EmptyStateIllustration() {
      return EmptyStateIllustration;
    }

    get ErrorStateIllustration() {
      return ErrorStateIllustration;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include column;

    color: $color-text-main-lighter;

    border-radius: 6px;
  }

  .column {
    @include column;

    align-items: center;

    width: 100%;
  }

  .value {
    color: $color-text-light;

    font-size: 20px;
    line-height: 24px;
  }
</style>
