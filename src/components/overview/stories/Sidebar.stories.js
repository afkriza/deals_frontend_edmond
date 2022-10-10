import {
  withKnobs,
  button,
  boolean,
  text,
  select
} from '@storybook/addon-knobs';

import Sidebar from '../Sidebar';

export default {
  title: 'Overview/Sidebar',
  decorators: [withKnobs]
};

const barChart = {
  type: 'bar',
  options: JSON.parse(
    '{"dataLabels":{"enabled":false},"fill":{"opacity":1},"stroke":{"curve":"smooth","width":5,"colors":["transparent"],"dashArray":[0]},"colors":["#AD1357"],"xaxis":{"categories":["01/2020","03/2020","04/2020","05/2020","06/2020","07/2020","08/2020","09/2020","10/2020","11/2020","12/2020"],"axisBorder":{"show":false},"axisTicks":{"show":false},"labels":{"style":{"colors":"#ADADAD"}},"convertedCatToNumeric":false},"legend":{"offsetY":-10,"labels":{"colors":["#4A4A4A"]},"markers":{"width":8,"height":8,"radius":4}},"tooltip":{"custom":{"_custom":{"type":"function","display":"<span>ƒ</span> customTooltip(_ref)"}},"x":{"show":false},"marker":{"show":false}},"chart":{"stacked":false,"toolbar":{"show":false,"tools":{"download":false,"selection":false,"zoom":false,"zoomin":false,"zoomout":false,"pan":false}}},"states":{"hover":{"filter":{"type":"lighten","value":0.01}}},"yaxis":{"labels":{"style":{"color":"#ADADAD"}}}}'
  ),
  series: JSON.parse(
    '[{"name":"RNT PLN","data":[26422,57622,61078,137230,200474,248006,268614,205075,57591,17050,15391],"color":"#AD1357","lineStyle":"solid"}]'
  )
};

const sidebarTemplate = `<div style="height: 100vh; display: flex;">
  <div style="flex: 1;" />
  <sidebar :title="title" :items="items" :showButton="show" />
</div>
`;

export const Default = () => ({
  components: { Sidebar },
  template: sidebarTemplate,
  props: {
    title: {
      type: String,
      default: text('Title', 'Tueseday 12')
    },
    itemTitle: {
      type: String,
      default: text('Item Title', 'Roomnight Booking Chart Example')
    },
    itemDescription: {
      type: String,
      default: text(
        'Item Description',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices mi quam, imperdiet aliquet mauris venenatis efficitur. Pellentesque ac metus iaculis, vehicula justo nec, pellentesque felis. Morbi ac felis vel dolor mollis gravida.'
      )
    },
    show: {
      type: Boolean,
      default: boolean('Show Buttons', false)
    }
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        if (this.show) {
          button('Add item', this.addItem);
          button('Remove item', this.removeItem);
        }
      }
    }
  },
  data() {
    return {
      items: [
        {
          title: this.itemTitle,
          description: this.itemDescription,
          data: barChart
        }
      ]
    };
  },
  methods: {
    addItem() {
      this.items.push({
        title: this.itemTitle,
        description: this.itemDescription,
        data: barChart
      });
    },
    removeItem() {
      this.items.pop();
    }
  }
});
