<template>
  <FormattingBadge
    :icon="icon"
    :color="seriesColor"
    :backgroundColor="backgroundColor"
  />
</template>

<script>
  import { colorByHex } from 'enums/chart-picker-colors';

  import { BAR, LINE } from 'constants/series-types';

  import FormattingBadge from '@/components/analytics/badges/FormattingBadge';

  import LineIcon from 'components/icons/formatting/Line';
  import BarIcon from 'components/icons/formatting/Bar';
  import AreaIcon from 'components/icons/formatting/Area';

  export default {
    components: {
      FormattingBadge
    },

    props: {
      seriesType: {
        type: String,
        required: true
      },

      seriesColor: {
        type: String,
        required: true
      }
    },

    computed: {
      icon() {
        if (this.seriesType === LINE) {
          return LineIcon;
        }

        if (this.seriesType === BAR) {
          return BarIcon;
        }

        return AreaIcon;
      },

      backgroundColor() {
        return colorByHex[this.seriesColor].background;
      }
    }
  };
</script>
