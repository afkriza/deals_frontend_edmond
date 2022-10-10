<template>
  <action-modal
    title="Are you sure you want to log out?"
    submitButtonText="Logout"
    @close="onClose"
    @submit="onSubmit"
  />
</template>

<script>
  import ActionModal from 'components/modals/ActionModal';

  export default {
    name: 'LogoutModal',
    components: {
      ActionModal
    },
    methods: {
      onClose() {
        this.$emit('close');
      },

      onSubmit() {
        this.$emit('submit');
      }
    }
  };
</script>
