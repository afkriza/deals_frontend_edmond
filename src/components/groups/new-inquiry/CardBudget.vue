<template>
  <BaseCard :class="$style.card">
    <InputCurrency
      v-model="budgetSync"
      :class="$style.input"
      label="Main budget (optional)"
      clearable
    />
    <InputCurrency
      v-model="ancillarySync"
      :class="$style.input"
      label="Ancillary expenses (optional)"
      clearable
    />
  </BaseCard>
</template>

<script lang="ts">
  import { Component, PropSync, Vue } from 'vue-property-decorator';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';

  @Component({
    components: { InputCurrency, BaseCard }
  })
  export default class CardBudget extends Vue {
    @PropSync('budget', {
      type: Number
    })
    readonly budgetSync: number;

    @PropSync('ancillary', {
      type: Number
    })
    readonly ancillarySync: number;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    align-items: center;
    padding: 28px 40px 50px;
  }

  .input {
    width: 160px;
  }

  .input + .input {
    margin-left: 16px;
  }
</style>
