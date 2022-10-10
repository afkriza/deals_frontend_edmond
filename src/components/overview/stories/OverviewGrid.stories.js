import OverviewGrid from '../OverviewGrid';

export default {
  title: 'Overview Grid',
  excludeStories: /.*Data$/
};

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const monthGridTemplate = `
<div style="margin: 20px;">
  <overview-grid style="border-top: 1px solid #E3E4E5; border-bottom: 1px solid #E3E4E5" :numberOfRows="1" :numberOfColumns="7" cellHeight="100%" isInverted isStriped :hasBorder="false">
    <template v-slot:tile="{index, row, column}">
      <span style="text-align: center; display: block; padding: 12px 0; color: #ADAFB2;">
        {{days[index]}} ({{row}}, {{column}})
      </span>
    </template>
  </overview-grid>
  <overview-grid :numberOfRows="5" :numberOfColumns="7" :showRowBorder="false" />
</div>
`;

const yearGridTemplate = `
<div style="margin: 20px">
  <overview-grid cellWidth="360px" :isStriped="false" :numberOfRows="3" :numberOfColumns="4">
    <template v-slot:tile="{row, column}">
       ({{row}}, {{column}})
    </template>
  </overview-grid>
</div>
`;

export const YearGrid = () => ({
  components: { OverviewGrid },
  template: yearGridTemplate
});

export const MonthGrid = () => ({
  components: { OverviewGrid },
  template: monthGridTemplate,
  data() {
    return {
      days
    };
  }
});
