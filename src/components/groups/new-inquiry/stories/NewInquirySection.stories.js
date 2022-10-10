import NewInquirySection from '../NewInquirySection';
import IconGroup from '@/assets/images/icons/Deals/group.svg';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Groups/NewInquiry/Section'
};

const template = `
  <NewInquirySection :title="title" :readonly="readonly">
    <template #icon><IconGroup /></template>
    <template #description>
      <p>You can define multiple alternatives for one group.</p>
      <p>Create multiple groups for a serial inquiry.</p>
    </template>
    <template>
      <div>
      content
      </div>
    </template>
  </NewInquirySection>
`;

export const Default = () => ({
  template,
  components: { NewInquirySection, IconGroup },
  props: {
    title: {
      default: text('Title', 'Group 1')
    },
    readonly: {
      default: boolean('Readonly', false)
    }
  }
});
