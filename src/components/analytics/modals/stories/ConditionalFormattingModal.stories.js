import { PortalTarget } from 'portal-vue';
import ConditionalFormattingModal from '../ConditionalFormattingModal';
import ConditionalFormatting from '@/classes/analytics/ConditionalFormatting';

export default {
  title: 'Widget/Wizard/ConditionalFormattingModal'
};

const template = `
<div>
    <ConditionalFormattingModal :formattings="formattings" />

    <PortalTarget name="modals" multiple>
    </PortalTarget>
</div>
`;

export const Default = () => ({
  template,
  components: { PortalTarget, ConditionalFormattingModal },
  data() {
    return {
      formattings: [
        new ConditionalFormatting({
          id: '1',
          backgroundColor: '#ffff00',
          textColor: '#000000',
          rule: 'Greater than',
          value: 950.5,
          saved: true
        })
      ]
    };
  }
});
