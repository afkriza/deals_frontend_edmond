import GridItem from '../GridItem';
import OverviewGrid from '../OverviewGrid';
import ProgressCard from '../ProgressCard';

import { cardThemeData, cardTypeData } from './ProgressCard.stories';

export default {
  title: 'Overview/Grid/Grid Item'
};

const yearGridItemTemplate = `
<div style="margin: 20px">
  <overview-grid cellWidth="min-content" cellHeight="294px" :isStriped="false" :numberOfRows="3" :numberOfColumns="4">
    <template v-slot:tile="{index, row, column}">
       <grid-item v-if="column === 0" style="padding: 56px; height: 100%; display:flex; flex-direction: column; justify-content: space-between; margin-left: auto; width: min-content" :title="month(index)">
        <progress-card style="padding: 24px; width: 265px; height: 136px;" flipProgressPercent :progress="1395" :total="9300" />
       </grid-item>
       <grid-item v-else style="padding: 56px; height: 100%; display:flex; flex-direction: column; justify-content: space-between; margin-right: auto; width: min-content" :title="month(index)">
        <progress-card style="padding: 24px; width: 265px; height: 136px;" flipProgressPercent :progress="1395" :total="9300" :type="cardTypes[index%cardTypes.length]" />
       </grid-item>
    </template>
  </overview-grid>
</div>
`;

export const Year = () => ({
  components: { GridItem, OverviewGrid, ProgressCard },
  template: yearGridItemTemplate,
  methods: {
    month(index) {
      return this.months[index];
    }
  },
  data() {
    return {
      cardTypes: cardTypeData.options,
      cardThemes: cardThemeData.options,
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    };
  }
});

const monthGridItemTemplate = `
<div style="margin: 20px;">
<overview-grid style="border-top: 1px solid #E3E4E5; border-bottom: 1px solid #E3E4E5" :numberOfRows="1" :numberOfColumns="7" cellWidth="195px" cellHeight="100%" isInverted isStriped :hasBorder="false">
    <template v-slot:tile="{index, row, column}">
      <span v-if="column === 0" style="margin-left: auto; width: 195px; text-align: center; display: block; padding: 12px 0; color: #ADAFB2;">
        {{days[index]}}
      </span>
      <span v-else style="width: 195px; text-align: center; display: block; padding: 12px 0; color: #ADAFB2;">
        {{days[index]}}
      </span>
    </template>
  </overview-grid>
  <overview-grid :numberOfRows="5" :numberOfColumns="7" cellWidth="195px" :showRowBorder="false">
    <template v-slot:tile="{index, row, column}">
       <grid-item v-if="column === 0" style="padding: 12px 16px 22px; height: 100%; display:flex; flex-direction: column; justify-content: space-between; margin-left: auto; width: min-content" :title="index+1+''" titleSize="10px">
        <progress-card style="margin-top: 6px; padding: 8px 12px 12px; width: 163px; height: 90px;" :progress="45" :total="300" />   
       </grid-item>
       <grid-item v-else style="padding: 12px 16px 22px; height: 100%; display:flex; flex-direction: column; justify-content: space-between; margin-right: auto; width: min-content" :title="index+1+''" titleSize="10px">
        <progress-card style="margin-top: 6px; padding: 8px 12px 12px; width: 163px; height: 90px;" :progress="45" :total="300" :type="cardTypes[index%cardTypes.length]" />
       </grid-item>
    </template>
  </overview-grid>
</div>
`;

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const Month = () => ({
  components: { GridItem, OverviewGrid, ProgressCard },
  template: monthGridItemTemplate,
  data() {
    return {
      days,
      cardTypes: cardTypeData.options
    };
  }
});
