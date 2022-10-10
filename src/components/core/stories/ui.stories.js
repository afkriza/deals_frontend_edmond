import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  number,
  text,
  boolean,
  select
} from '@storybook/addon-knobs';

import BasicDropdown from 'components/core/BasicDropdown';
import SimpleDropdown from 'components/core/SimpleDropdown';

export default {
  title: 'Core',
  decorators: [withKnobs]
};

export const basicDropdown = () => ({
  components: { BasicDropdown },
  template:
    '<basic-dropdown :offset="offset" :isOpen="isOpen" :disabled="disabled" @dropdown:close="onDropdownClose" @dropdown:open="onDropdownOpen">Dropdown opened</basic-dropdown>',
  props: {
    disabled: {
      type: Boolean,
      default: boolean('Disabled', false)
    },
    isOpen: {
      type: Boolean,
      default: boolean('Is Open', false)
    },
    horizontal: {
      type: Number,
      default: number('Horizontal Offset', -25)
    },
    vertical: {
      type: Number,
      default: number('Vertical Offset', 15)
    }
  },
  computed: {
    offset() {
      return {
        horizontal: this.horizontal,
        vertical: this.vertical
      };
    }
  },
  methods: {
    onDropdownClose: action('Dropdown Closed'),
    onDropdownOpen: action('Dropdown Opened')
  }
});

const simpleDropdownTheme = {
  name: 'Theme',
  options: ['dark', 'light']
};

const simpleDropdownType = {
  name: 'Type',
  options: ['arrow', 'clean']
};

export const simpleDropdown = () => ({
  components: { SimpleDropdown },
  template:
    '<div :style="{padding: padding, backgroundColor: bgColor}"><simple-dropdown :type="type" :theme="theme" :offset="offset" :isOpen="isOpen" :disabled="disabled" @dropdown:close="onDropdownClose" @dropdown:open="onDropdownOpen"><template slot="trigger">{{ title }}</template>{{ content }}</simple-dropdown></div>',
  props: {
    theme: {
      type: String,
      default: select(
        simpleDropdownTheme.name,
        simpleDropdownTheme.options,
        simpleDropdownTheme.options[0]
      )
    },
    type: {
      type: String,
      default: select(
        simpleDropdownType.name,
        simpleDropdownType.options,
        simpleDropdownType.options[0]
      )
    },
    title: {
      type: String,
      default: text('Menu Title', 'Menu')
    },
    content: {
      type: String,
      default: text('Dropdown content', 'Dropdown content')
    },
    horizontal: {
      type: Number,
      default: number('Horizontal Offset', 0)
    },
    vertical: {
      type: Number,
      default: number('Vertical Offset', 15)
    },
    disabled: {
      type: Boolean,
      default: boolean('Disabled', false)
    },
    isOpen: {
      type: Boolean,
      default: boolean('Is Open', false)
    }
  },
  computed: {
    padding() {
      return '30px 10px';
    },
    offset() {
      return {
        horizontal: this.horizontal,
        vertical: this.vertical
      };
    },
    bgColor() {
      return this.theme === 'light' ? '#444D56' : '#FFFFFF';
    }
  },
  methods: {
    onDropdownClose: action('Dropdown Closed'),
    onDropdownOpen: action('Dropdown Opened')
  }
});
