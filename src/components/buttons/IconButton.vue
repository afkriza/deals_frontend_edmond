<template>
  <button-flat v-bind="$attrs" v-on="$listeners">
    <div :class="[$style.content, contentClass && contentClass]">
      <slot name="icon" />
      <slot name="text" />
    </div>
  </button-flat>
</template>

<script>
  import ButtonFlat from 'components/buttons/ButtonFlat';

  export default {
    components: {
      ButtonFlat
    },
    props: {
      contentClass: {
        type: String
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .content {
    width: 100%;
    display: inline-flex;
    align-items: center;
  }
</style>
