import ConditionalFormattingModalRow from '../ConditionalFormattingModalRow';
import ConditionalFormatting from '@/classes/analytics/ConditionalFormatting';

export default {
  title: 'Widget/Wizard/ConditionalFormattingModalRow'
};

const template = `
  <ConditionalFormattingModalRow :formatting="formatting" />
`;

export const Default = () => ({
  template,
  components: { ConditionalFormattingModalRow },
  data() {
    return {
      formatting: new ConditionalFormatting({
        id: '1',
        backgroundColor: '#ff0000',
        textColor: '#000000',
        rule: 'Greater than',
        value: 920.5
      })
    };
  }
});
