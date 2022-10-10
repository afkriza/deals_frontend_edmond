import { number, select, withKnobs } from '@storybook/addon-knobs';

import ProgressCard from '../ProgressCard.vue';

export default {
  title: 'Overview/Calendar/Month',
  decorators: [withKnobs],
  excludeStories: /.*Data$/
};

export const cardTypeData = {
  name: 'Type',
  options: ['none', 'do', 'look', 'done']
};

export const cardThemeData = {
  name: 'Theme',
  options: ['normal', 'active']
};

const cardLayout = {
  name: 'Layout',
  options: ['card', 'row']
};

const monthCardTemplate =
  '<progress-card style="padding: 8px 12px 12px; width: 163px; height: 90px; margin: 20px;" :progress="progress" :total="total" :type="type" :theme="theme" />';

const cardProps = () => ({
  theme: {
    type: String,
    default: select(
      cardThemeData.name,
      cardThemeData.options,
      cardThemeData.options[0]
    )
  },
  type: {
    type: String,
    default: select(
      cardTypeData.name,
      cardTypeData.options,
      cardTypeData.options[1]
    )
  },
  progress: {
    type: Number,
    default: number('progress', 240)
  },
  total: {
    type: Number,
    default: number('total', 300)
  }
});

export const monthProgressCard = () => ({
  components: { ProgressCard },
  template: monthCardTemplate,
  props: cardProps()
});

const yearCardTemplate =
  '<progress-card style="padding: 24px; width: 265px; height: 136px; margin: 20px;" flipProgressPercent :progress="progress" :total="total" :type="type" :theme="theme" />';
export const yearProgressCard = () => ({
  components: { ProgressCard },
  template: yearCardTemplate,
  props: cardProps()
});

const rowCardTemplate =
  '<progress-card style="padding: 16px 16px 16px 24px; width: 478px; height: 64px; margin: 20px;" layout="row" :progress="progress" :total="total" :type="type" :theme="theme" />';

export const progressRow = () => ({
  components: { ProgressCard },
  template: rowCardTemplate,
  props: cardProps()
});
