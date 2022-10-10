<template>
  <div :class="$style.multiSwitch">
    <multi-switch-item
      v-for="switcherMode in switcherModes"
      :key="switcherMode"
      :isInverted="isInverted"
      :btnClass="btnClass"
      :isActive="isActive(switcherMode)"
      @click="handleItemClick(switcherMode)"
    >
      <slot :switcherMode="switcherMode" />
    </multi-switch-item>
  </div>
</template>

<script>
  import MultiSwitchItem from 'components/core/MultiSwitchItem';

  export default {
    components: {
      MultiSwitchItem
    },
    props: {
      switcherModes: {
        type: Array,
        required: true
      },
      currentSwitcherMode: {
        required: true
      },
      isInverted: {
        type: Boolean,
        default: false
      },
      btnClass: {
        type: String
      }
    },
    methods: {
      isActive(switcherMode) {
        return this.currentSwitcherMode === switcherMode;
      },
      handleItemClick(switcherMode) {
        return this.$emit(
          'change',
          this.isActive(switcherMode) ? '' : switcherMode
        );
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .multi-switch {
    display: flex;
  }
</style>
