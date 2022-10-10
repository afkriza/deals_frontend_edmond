import WidgetCard from '../WidgetCard';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Dashboard/WidgetCard',
  decorators: [withKnobs]
};

const template = `
  <WidgetCard
    style="max-width: 500px; height: 600px; margin: 20px;"
    :widget-name="widgetName"
    :is-loading="isLoading"
    :is-empty="isEmpty"
    :is-error="isError"
   />
`;

export const Default = () => ({
  template,
  components: { WidgetCard },
  props: {
    widgetName: {
      default: text('Widget name', 'Widget (1)')
    },
    isLoading: {
      default: boolean('Loading', false)
    },
    isEmpty: {
      default: boolean('Empty', false)
    },
    isError: {
      default: boolean('Error', false)
    }
  }
});
