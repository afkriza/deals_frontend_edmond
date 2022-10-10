import DateRangeInput from '../DateRangeInput';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/DateRangeInput'
};

export const Default = () => ({
  template: `
    <DateRangeInput 
      style="margin: 20px;" 
      :from.sync="from" 
      :to.sync="to" 
      :placeholderFrom="placeholderFrom"
      :placeholderTo="placeholderTo"
      :helper-text="helperText" 
      :dark="dark" 
      :error="error" 
      :disabled="disabled" 
      :show-icon="showIcon"
    />
  `,
  components: { DateRangeInput },
  props: {
    placeholderFrom: {
      default: text('Placeholder From', 'Placeholder From')
    },
    placeholderTo: {
      default: text('Placeholder To', 'Placeholder To')
    },
    helperText: {
      default: text('Helper text', 'Helper text')
    },
    error: {
      default: boolean('Error', false)
    },
    disabled: {
      default: boolean('Disabled', false)
    },
    showIcon: {
      default: boolean('Show icon', false)
    }
  },
  data() {
    return {
      from: '',
      to: ''
    };
  }
});

export const Dark = () => ({
  template: `
    <div style="background-color: #2A3139; padding: 20px;">
      <DateRangeInput
        :from.sync="from"
        :to.sync="to"
        :placeholderFrom="placeholderFrom"
        :placeholderTo="placeholderTo"
        :helper-text="helperText"
        dark
        :error="error"
        :disabled="disabled"
        :show-icon="showIcon"
      />
    </div>
  `,
  components: { DateRangeInput },
  props: {
    placeholderFrom: {
      default: text('Placeholder From', 'Placeholder From')
    },
    placeholderTo: {
      default: text('Placeholder To', 'Placeholder To')
    },
    helperText: {
      default: text('Helper text', 'Helper text')
    },
    error: {
      default: boolean('Error', false)
    },
    disabled: {
      default: boolean('Disabled', false)
    },
    showIcon: {
      default: boolean('Show icon', false)
    }
  },
  data() {
    return {
      from: '',
      to: ''
    };
  }
});
