<template>
  <dropdown-list
    :class="$style.list"
    :items="items"
    v-on="$listeners"
    @select="onClick"
  >
    <template v-slot:item="{ item }">
      <span>{{ item.name }}</span>
      <span :class="$style.abbr">{{ item.abbr }}</span>
    </template>
  </dropdown-list>
</template>

<script>
  import DropdownList from '../core/DropdownList';

  export default {
    name: 'TimeGranulationDropdownList',
    components: { DropdownList },
    extends: DropdownList
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .list {
    background-color: $color-bg-light;
    padding: 8px 0;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    color: $color-text-main;
  }

  .abbr {
    margin-left: auto;
    color: $color-text-main-lighter;
  }
</style>
