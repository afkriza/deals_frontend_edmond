<template>
  <BaseCard :class="$style.card">
    <ValidationField :v="v.deal.name" :error-messages="errorMessagesName">
      <template #default="{ isError, errorMessage }">
        <InputText
          v-model="nameSync"
          :class="$style.inputName"
          label="Deal name"
          :error="isError"
          :message="errorMessage"
          @focus="v.deal.name.$reset()"
        />
      </template>
    </ValidationField>
    <InputTextarea
      v-model="noteSync"
      :wrapper-class="$style.textarea"
      label="Note (optional)"
    />
    <div :class="$style.row">
      <InputCheckbox v-model="prioritySync" label="Prioritize this deal" />
      <IconInfo
        v-tooltip.bottom="{
          content:
            'The prioritized deal will appear on top of the revenue manager list.',
          classes: [$style.tooltip]
        }"
        :class="$style.info"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts">
  import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import CheckboxIcon from '@/components/inputs/CheckboxIcon.vue';
  import InputTextarea from '@/components/inputs/new/InputTextarea.vue';
  import IconInfo from '@/assets/images/icons/groups/new-inquiry/info.svg';
  import InputCheckbox from '@/components/inputs/new/InputCheckbox.vue';
  import InputText from '@/components/inputs/new/InputText.vue';
  import ValidationField from '@/components/renderless/ValidationField';

  import { errorMessagesFactory } from '@/utils/validation';

  @Component({
    components: {
      ValidationField,
      InputText,
      InputCheckbox,
      InputTextarea,
      CheckboxIcon,
      InputCurrency,
      BaseCard,
      IconInfo
    },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class CardDetails extends Vue {
    @PropSync('name', {
      type: String,
      required: true
    })
    readonly nameSync: string;

    @PropSync('note', {
      type: String,
      required: true
    })
    readonly noteSync: string;

    @PropSync('priority', {
      type: Boolean,
      required: true
    })
    readonly prioritySync: number;

    @Prop({
      type: Object
    })
    readonly v;

    get errorMessagesName() {
      return errorMessagesFactory('required', 'Please enter the deal name');
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include column;
    padding: 28px 40px 36px;

    & > * + * {
      margin-top: 28px;
    }
  }

  .textarea {
    height: 108px;
  }

  .input-name,
  .textarea {
    width: 336px;
  }

  .row {
    @include row;
  }

  .info {
    color: $color-text-main-lighter;
    margin-left: 8px;
    cursor: pointer;
  }

  .tooltip :global(.tooltip-inner) {
    width: 280px;
    padding: 16px;
  }
</style>
