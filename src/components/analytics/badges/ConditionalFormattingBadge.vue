<template>
  <formatting-badge
    :icon="icon"
    :color="color"
    :backgroundColor="backgroundColor"
  />
</template>

<script>
  import ConditionalFormattingModel from 'classes/analytics/ConditionalFormatting';
  import FormattingBadge from 'components/analytics/badges/FormattingBadge';

  import ConditionalIcon from 'components/icons/formatting/Conditional';

  export default {
    components: {
      FormattingBadge,
      ConditionalIcon
    },

    props: {
      formatting: {
        type: ConditionalFormattingModel,
        required: true
      }
    },

    computed: {
      icon() {
        return ConditionalIcon;
      },

      color() {
        return this.formatting.textColor;
      },

      backgroundColor() {
        return this.formatting.backgroundColor;
      }
    }
  };
</script>
