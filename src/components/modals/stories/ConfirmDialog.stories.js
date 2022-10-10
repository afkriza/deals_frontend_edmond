import ConfirmDialog from '../ConfirmDialog';
import { modalSizesEnum } from '../../../enums/modal-sizes';

import Vue from 'vue';
import PortalVue from 'portal-vue';

Vue.use(PortalVue);

export default {
  title: 'Groups/Modals'
};

const template = `
  <div>
    <confirm-dialog title="Decline inquiry?" :size="size" :isDestructive="true" :resetButtonWidth="true" :isDarkThemed="true" dismissText="No, keep it open" confirmText="Yes, decline inquiry">
      Are you sure you want to decline inquiry #44357?
    </confirm-dialog>
    <portal-target name="modals" multiple />
</div>
  `;

export const confirmDialog = () => ({
  template,
  components: { ConfirmDialog },
  computed: {
    size() {
      return modalSizesEnum.SMALL;
    }
  }
});
