<template>
  <div>
    <NewInquirySection title="Budget">
      <template #icon>
        <IconBudget />
      </template>
      <template #description>
        <p :class="$style.info">
          Main budget for rooms and services. Put additional expenses into
          ancillary expenses.
        </p>
      </template>
      <template>
        <div :class="$style.card">
          <InputCurrency label="Main budget" v-model="budgetSync" />
          <InputCurrency
            label="Ancillary expenses (optional)"
            v-model="ancillarySync"
          />
        </div>
      </template>
    </NewInquirySection>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
  import NewInquirySection from '@/components/groups/new-inquiry/NewInquirySection.vue';
  import IconBudget from '@/assets/images/icons/groups/new-inquiry/budget.svg';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';

  @Component({
    components: { InputCurrency, NewInquirySection, IconBudget }
  })
  export default class BudgetSection extends Vue {
    @PropSync('budget', {
      type: Number
    })
    private budgetSync: number;

    @PropSync('ancillary', {
      type: Number
    })
    private ancillarySync: number;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .info {
    margin: 0;

    line-height: 20px;

    max-width: 208px;
  }

  .card {
    @include row;
    padding: 28px 40px;

    background-color: $color-bg-light;

    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    border-radius: 4px;

    margin-left: 32px;

    > * + * {
      margin-left: 16px;
    }
  }
</style>
