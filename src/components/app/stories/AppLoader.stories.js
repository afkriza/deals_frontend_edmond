import AppLoader from '../AppLoader';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Core/AppLoader'
};

const template = `
<AppLoader :loading-text="loadingText" />
`;

export const Default = () => ({
  template,
  components: { AppLoader },
  props: {
    loadingText: {
      default: text('Loading text', 'Loading data...')
    }
  }
});
