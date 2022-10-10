<template>
  <div>
    <PartnerInfo :id="partner.id" :name="partner.name" />
    <PartnerAddress
      :address="partner.address"
      :postal-code="partner.postalCode"
      :city="partner.city"
      :country="partner.country"
    />
    <PartnerContacts :contacts="partner.partnerContacts" />
    <span
      v-if="hasAccess(Role.Admin, Role.Sales)"
      :class="$style.buttonsContainer"
    >
      <ButtonGhost
        v-tooltip.right-end="{
          content: 'Delete partner',
          offset: '50 , -70'
        }"
        :class="$style.btnOval"
        oval
        destructive
        @click.stop="deletePartner(partner)"
      >
        <template #icon>
          <IconDelete />
        </template>
      </ButtonGhost>
      <ButtonGhost
        v-tooltip.right-end="{
          content: 'Edit partner',
          offset: '50 , -70'
        }"
        :class="$style.btnOval"
        oval
        @click.stop="editPartner(partner)"
      >
        <template #icon>
          <IconEdit />
        </template>
      </ButtonGhost>
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { VTooltip } from 'v-tooltip';
  import PartnerInfo from './cards/PartnerInfo';
  import PartnerAddress from './cards/PartnerAddress';
  import PartnerContacts from './cards/PartnerContacts';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import IconDelete from '@/assets/images/icons/Misc/ic-24-delete.svg';
  import IconEdit from '@/assets/images/icons/Misc/ic-24-edit.svg';

  import { Role } from '@/enums/Role.enum';

  export default {
    name: 'PartnerRow',
    components: {
      PartnerInfo,
      PartnerAddress,
      PartnerContacts,
      ButtonGhost,
      IconDelete,
      IconEdit
    },
    directives: {
      tooltip: VTooltip
    },
    props: {
      partner: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        Role
      };
    },
    computed: {
      ...mapGetters(['hasAccess'])
    },
    methods: {
      deletePartner(partner) {
        this.$emit('delete:partner', partner);
      },

      editPartner(partner) {
        this.$emit('edit:partner', partner);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .buttons-container {
    display: flex;
    justify-content: flex-end;
  }

  .btn-oval {
    width: 36px;
    height: 36px;

    color: $color-text-main;

    &:first-child {
      margin-right: 4px;
    }
  }
</style>
