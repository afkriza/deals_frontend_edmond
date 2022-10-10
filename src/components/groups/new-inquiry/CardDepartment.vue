<template>
  <BaseCard :class="$style.card">
    <ValidationField
      :v="v.deal.department"
      :error-messages="errorMessagesDepartment"
    >
      <template #default="{ isError, errorMessage }">
        <InputRadioGroup
          v-model="departmentSync"
          :options="departments"
          vertical
          value-attr="id"
          label-attr="name"
          :error="isError"
          :message="errorMessage"
        />
      </template>
    </ValidationField>
  </BaseCard>
</template>

<script lang="ts">
  import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import InputRadioGroup from '@/components/inputs/new/InputRadioGroup.vue';

  import { errorMessagesFactory } from '@/utils/validation';
  import ValidationField from '@/components/renderless/ValidationField';
  import { SalesDepartment } from '@/models/SalesDepartment.model';

  @Component({
    components: { ValidationField, InputRadioGroup, InputCurrency, BaseCard }
  })
  export default class CardDepartment extends Vue {
    @PropSync('department', {
      type: String
    })
    readonly departmentSync: SalesDepartment;

    @Prop({
      type: Array,
      required: true
    })
    readonly departments: SalesDepartment[];

    @Prop({
      type: Object
    })
    readonly v;

    get errorMessagesDepartment() {
      return errorMessagesFactory('required', 'Please select the department');
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    padding: 24px 40px 44px;
  }
</style>
