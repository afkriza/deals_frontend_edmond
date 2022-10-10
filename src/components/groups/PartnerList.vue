<template>
  <DropdownList
    :class="$style.dropdown"
    :items="partners"
    @select="$emit('select', $event)"
  >
    <template #item="{item, isHover}">
      <PartnerListItem
        :name="item.name"
        :description="description(item)"
        :is-hover="isHover"
      />
    </template>
  </DropdownList>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import DropdownList from '@/components/core/DropdownList.vue';
  import PartnerListItem from '@/components/groups/PartnerListItem.vue';

  @Component({
    components: { PartnerListItem, DropdownList }
  })
  export default class PartnerList extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly partners;

    description(partner) {
      return partner.postcode && partner.city && partner.country
        ? `${partner.address}, ${partner.postcode} ${partner.city}, ${partner.country}`
        : '';
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .dropdown {
    padding: 8px 0;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: $color-bg-light;

    width: 560px;
  }
</style>
