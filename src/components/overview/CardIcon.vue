<template>
  <span :class="[$style.wrapper, $style[theme]]">
    <component :is="icon" :theme="theme" />
  </span>
</template>

<script>
  import LookIcon from '@/components/icons/overview/Look.vue';
  import DoIcon from '@/components/icons/overview/Do.vue';
  import DoneIcon from '@/components/icons/overview/Done.vue';
  import { CARD_ACTIONS, CARD_STATUSES } from '@/constants/overview';

  const iconsByTypes = {
    look: LookIcon,
    do: DoIcon,
    done: DoneIcon
  };

  export default {
    name: 'CardIcon',
    components: {
      LookIcon,
      DoIcon,
      DoneIcon
    },
    props: {
      type: {
        type: String,
        required: true,
        validator(value) {
          return CARD_ACTIONS.includes(value);
        }
      },
      theme: {
        type: String,
        required: true,
        validator(theme) {
          return CARD_STATUSES.includes(theme);
        }
      }
    },
    computed: {
      icon() {
        return iconsByTypes[this.type];
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include flex-center($is-inline: true);
    cursor: pointer;
    min-height: 28px;
    min-width: 28px;
    border-radius: 4px;
    background-color: white;

    &.bad {
      // background-color: $color-bad-lighter;
      border: 1px solid $color-bad-darker;
    }

    &.mid {
      // background-color: $color-mid-lighter;
      border: 1px solid $color-mid-darker;
    }

    &.good {
      // background-color: $color-good-lighter;
      border: 1px solid $color-good-darker;
    }
  }
</style>
