<template>
  <action-modal
    :isDestructive="true"
    title="Delete member"
    submitButtonText="Delete"
    cancelButtonText="Cancel"
    :isLoading="loading"
    @submit="onSubmit"
    @close="onCancel"
  >
    <p>
      <strong>Warning: this cannot be undone.</strong>
    </p>
    <p>
      Deleting
      <strong>{{ member.name }}</strong> will permanently remove all their
      information from the database which means that they will:
    </p>
    <ul :class="$style.list">
      <li>Lose access to Edmond RMS,</li>
      <li>No longer recieve email reports,</li>
      <li>All shared links will be invalid.</li>
    </ul>
  </action-modal>
</template>
<script>
  import ActionModal from 'components/modals/ActionModal';

  import { toastTypesEnum } from 'enums/toast-types';
  import { getMemberRoleId } from 'utils/members';

  export default {
    components: {
      ActionModal
    },
    props: {
      member: {
        type: Object,
        required: true
      },

      loading: {
        type: Boolean,
        default: false
      },

      done: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close() {
        this.$emit('deleteMember:close');
      },

      onCancel() {
        this.close();
      },

      onSubmit() {
        const memberRole = getMemberRoleId(this.member);
        const toast = {
          message: `Deleted&nbsp; <strong>${this.member.name}</strong>`,
          type: toastTypesEnum.DELETE
        };

        this.$emit('deleteMember:submit', this.member, memberRole, toast);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .list {
    padding-left: 35px;
  }
</style>
