<template>
  <button :class="$style.button" v-on="$listeners">
    <IconAdd />
    <span :class="$style.text">{{ text }}</span>
  </button>
</template>

<script>
  import IconAdd from '@/assets/images/icons/add.svg';

  export default {
    components: {
      IconAdd
    },

    props: {
      text: {
        type: String,
        default: 'Add'
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    @include row;
    @include button;
    text-transform: none;
    align-items: center;

    padding: 4px 16px;
    line-height: 20px;

    color: $color-text-primary;

    & > * + * {
      margin-left: 8px;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }
</style>
