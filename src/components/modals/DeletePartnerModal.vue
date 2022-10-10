<template>
  <ActionModal
    :isLoading="isLoading"
    :isDestructive="true"
    title="Delete partner?"
    submitButtonText="Delete partner"
    cancelButtonText="Cancel"
    width="760px"
    @submit="onSubmit"
    @close="close"
  >
    <div>
      {{ 'Are you sure you want to delete partner' }}
      <span :class="$style.partnerName">{{ partner.name }}</span>
      <span>{{
        '?\nThe partner will be deleted immediately. You can’t undo this action.'
      }}</span>
    </div>
  </ActionModal>
</template>

<script>
  import ActionModal from 'components/modals/ActionModal';
  import InputText from '@/components/inputs/new/InputText';
  import ValidationField from '@/components/renderless/ValidationField';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import IconFavoriteFilled from '@/assets/images/icons/Misc/ic-24-favorite-active.svg';
  import IconFavoriteUnfilled from '@/assets/images/icons/Misc/ic-24-favorite-default.svg';
  import IconDelete from '@/assets/images/icons/Misc/ic-24-delete.svg';
  import IconAdd from '@/assets/images/icons/add-flat.svg';
  import { Partner } from '@/models/groups/Partner.model';

  export default {
    extends: ActionModal,
    components: {
      ButtonGhost,
      ValidationField,
      InputText,
      ActionModal,
      IconAdd,
      IconFavoriteFilled,
      IconFavoriteUnfilled,
      IconDelete
    },

    props: {
      partner: {
        type: Partner
      },

      isLoading: {
        type: Boolean,
        default: false
      }
    },

    computed: {},

    methods: {
      onSubmit() {
        this.$emit('submit', this.partner);
      },

      close() {
        this.$emit('close');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';
</style>
