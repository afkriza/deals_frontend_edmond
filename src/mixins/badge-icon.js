import {
  DEFAULT_FORMATTING_COLOR,
  DEFAULT_FORMATTING_BG_COLOR
} from 'constants/badge-icon';

export default {
  props: {
    color: {
      type: String,
      default: DEFAULT_FORMATTING_COLOR
    },
    backgroundColor: {
      type: String,
      default: DEFAULT_FORMATTING_BG_COLOR
    }
  },

  computed: {
    color_() {
      return this.color || DEFAULT_FORMATTING_COLOR;
    },
    backgroundColor_() {
      return this.backgroundColor || DEFAULT_FORMATTING_BG_COLOR;
    }
  }
};
