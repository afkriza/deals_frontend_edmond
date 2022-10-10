<template>
  <div :class="$style.multiSwitch">
    <MultiSwitchButton
      v-for="switcherMode in switcherModes"
      :key="switcherMode"
      :is-active="isActive(switcherMode)"
      @click="handleItemClick(switcherMode)"
    >
      <slot :switcherMode="switcherMode" />
    </MultiSwitchButton>
  </div>
</template>

<script>
  import MultiSwitchButton from 'components/core/MultiSwitchButton';

  export default {
    components: {
      MultiSwitchButton
    },
    props: {
      switcherModes: {
        type: Array,
        required: true
      },
      currentSwitcherMode: {
        required: true
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
