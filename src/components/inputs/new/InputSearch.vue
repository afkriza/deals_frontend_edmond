<template>
  <InputSelect v-bind="$attrs" v-on="$listeners" searchable>
    <template #append>
      <IconSearch :class="$style.icon" />
    </template>

    <!--  Slot forwarding: https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component  -->
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </InputSelect>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import IconSearch from '@/assets/images/icons/search.svg';
  import DropdownList from '@/components/core/DropdownList.vue';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';

  @Component({
    components: { InputSelect, DropdownList, InputBase, IconSearch, VPopover },
    inheritAttrs: false,
    model: {
      event: 'select'
    }
  })
  export default class InputSearch extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .icon {
    margin: 6px;
    align-self: center;
  }
</style>
