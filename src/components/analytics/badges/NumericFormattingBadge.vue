<template>
  <formatting-badge>
    <template v-if="type === numericFormattingTypesEnum.PERCENTAGE">
      <!-- @svg("formatting/percentage") -->
    </template>
    <template v-else-if="type === numericFormattingTypesEnum.CURRENCY">
      <!-- @svg("formatting/currency") -->
    </template>
  </formatting-badge>
</template>

<script>
  import FormattingBadge from '../FormattingBadge';

  import { numericFormattingTypesEnum } from 'enums/numeric-formatting-types';

  export default {
    components: {
      FormattingBadge
    },

    props: {
      type: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        numericFormattingTypesEnum
      };
    }
  };
</script>
