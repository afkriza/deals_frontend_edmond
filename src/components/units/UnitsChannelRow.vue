<template>
  <div :class="$style.wrapper">
    <slot name="master" :units="units" :channel="channel" />
    <template v-for="unit in unitsByRoomType">
      <slot name="unit" :unit="unit[0]" />
    </template>
  </div>
</template>

<script>
  import { groupBy } from 'utils/collection';

  export default {
    props: {
      units: {
        type: Array,
        required: true
      },
      channel: {
        type: Object,
        required: true
      },
      unitTypes: {
        type: Array,
        required: true
      }
    },
    computed: {
      unitsByRoomType() {
        const groups = groupBy(this.units, unit => unit.unitType.id);
        return this.unitTypes.map(type => groups[type.id]);
      }
    },
    methods: {},
    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    display: flex;
  }

  .channel-master {
    border-left: 1px solid $color-border-main;
    border-right: 1px solid $color-border-main;
    margin-right: 10px;
    display: flex;
  }
</style>
