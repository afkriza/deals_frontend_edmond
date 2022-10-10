import { withKnobs } from '@storybook/addon-knobs';

import CheckboxIcon from '../CheckboxIcon.vue';

export default {
  title: 'Core/Inputs',
  decorators: [withKnobs]
};

const infoIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 8C1.25 4.27208 4.27208 1.25 8 1.25C11.7279 1.25 14.75 4.27208 14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8ZM8 2.75C5.10051 2.75 2.75 5.10051 2.75 8C2.75 10.8995 5.10051 13.25 8 13.25C10.8995 13.25 13.25 10.8995 13.25 8C13.25 5.10051 10.8995 2.75 8 2.75ZM8 7C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7ZM8.75 8.5C8.75 8.08579 8.41421 7.75 8 7.75C7.58579 7.75 7.25 8.08579 7.25 8.5V10.5C7.25 10.9142 7.58579 11.25 8 11.25C8.41421 11.25 8.75 10.9142 8.75 10.5V8.5Z" fill="#ADAFB2"/>
</svg>`;
export const checkboxIcon = () => ({
  components: { CheckboxIcon },
  template: `<checkbox-icon :checked="checked" @checked:update="onClick" ><template v-slot:title>Priority request</template><template v-slot:icon>${infoIcon}</template></checkbox-icon>`,
  data() {
    return {
      checked: false
    };
  },
  methods: {
    onClick() {
      this.checked = !this.checked;
    }
  }
});
