<template>
  <BaseCard :class="$style.card">
    <div :class="$style.content">
      <template v-for="unit in group.offerGroupUnits">
        <slot name="unit" :unit="unit" />
      </template>
    </div>
    <ButtonGhost
      :class="$style.button"
      text="Add group"
      type="button"
      @click="$emit('group:add')"
    >
      <template #icon>
        <IconAddFlat />
      </template>
    </ButtonGhost>
  </BaseCard>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import AddAlternativeForm from '@/components/groups/new-inquiry/AddAlternativeForm.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconAddFlat from '@/assets/images/icons/add-flat.svg';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import AlternativeView from '@/components/groups/new-inquiry/AlternativeView.vue';
  import OfferGroup from '@/components/groups/new-offer/models/OfferGroup.model';

  @Component({
    components: {
      AlternativeView,
      BaseCard,
      ButtonGhost,
      AddAlternativeForm,
      IconAddFlat
    }
  })
  export default class CardGroup extends Vue {
    @Prop({
      type: OfferGroup,
      default: () => ({})
    })
    readonly group;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly roomTypes;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly packages;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include column;
  }

  .content {
    flex: 1;
  }

  .button {
    width: 100%;
    height: 72px;

    justify-content: flex-start;

    border: none !important;
    border-radius: 0;
    padding: 24px 40px;
  }
</style>
